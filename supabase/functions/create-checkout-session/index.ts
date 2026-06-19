import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2022-11-15",
  httpClient: Stripe.createFetchHttpClient(),
})

const ALLOWED_ORIGINS = [
  "https://fleetconnect.be",
  "https://www.fleetconnect.be",
  "https://portal.fleetconnect.be",
  "https://client.fleetconnect.be",
  "https://partners.fleetconnect.be",
  "https://fleetconnectfork.vercel.app",
  "https://fleet-connect-fork.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
]

const EXTRA_ALLOWED_ORIGINS = (Deno.env.get("FLEETCONNECT_ALLOWED_ORIGINS") || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

function isAllowedFleetConnectOrigin(origin: string | null) {
  if (!origin) return false
  if (ALLOWED_ORIGINS.includes(origin) || EXTRA_ALLOWED_ORIGINS.includes(origin)) return true

  try {
    const url = new URL(origin)
    if (url.protocol !== "https:") return false
    return (
      url.hostname === "fleetconnect.be" ||
      url.hostname.endsWith(".fleetconnect.be") ||
      /^fleetconnectfork(-.*)?\.vercel\.app$/.test(url.hostname) ||
      /^fleet-connect-fork(-.*)?\.vercel\.app$/.test(url.hostname)
    )
  } catch (_) {
    return false
  }
}

function originFromUrl(value: string) {
  try {
    return new URL(value).origin
  } catch (_) {
    return null
  }
}

function jsonResponse(body: Record<string, unknown>, status: number, headers: HeadersInit) {
  return new Response(JSON.stringify(body), {
    headers: { ...headers, "Content-Type": "application/json" },
    status,
  })
}

serve(async (req) => {
  const origin = req.headers.get("origin")
  const isAllowedOrigin = isAllowedFleetConnectOrigin(origin)
  const corsHeaders = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    if (origin && !isAllowedOrigin) {
      return jsonResponse({ error: "Unauthorized origin" }, 403, corsHeaders)
    }
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders)
    }
    if (!Deno.env.get("STRIPE_SECRET_KEY")) {
      throw new Error("Stripe secret is not configured")
    }
    if (!Deno.env.get("SUPABASE_URL") || !Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
      throw new Error("Supabase service configuration is missing")
    }

    const { bookingId, email, paymentMethodType, successUrl, cancelUrl, customerId } = await req.json()
    if (!bookingId || !email || !successUrl || !cancelUrl) {
      throw new Error("Missing required checkout fields")
    }
    if (!isAllowedFleetConnectOrigin(originFromUrl(successUrl)) || !isAllowedFleetConnectOrigin(originFromUrl(cancelUrl))) {
      throw new Error("Invalid checkout redirect URL")
    }

    // Initialize Supabase with SERVICE ROLE for DB writes
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // 1. Fetch booking to verify and check for active session
    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (bookingError || !booking) {
      throw new Error("Booking not found")
    }
    if (booking.email && booking.email.toLowerCase() !== String(email).toLowerCase()) {
      throw new Error("Booking email mismatch")
    }

    // 2. Duplicate Payment Protection (DB Level)
    if (booking.payment_status === 'paid') {
        throw new Error("Booking already paid")
    }
    const bookingAmount = Number(booking.amount)
    if (!Number.isFinite(bookingAmount) || bookingAmount < 15) {
      throw new Error("Booking amount is invalid")
    }

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: paymentMethodType === "App" ? ["bancontact"] : ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `FleetConnect Rit: ${bookingId}`,
              description: `Van ${booking.pickup} naar ${booking.destination}`,
            },
            unit_amount: Math.round(bookingAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: bookingId,
      invoice_creation: {
        enabled: true,
      },
      metadata: {
        booking_id: bookingId,
        customer_id: customerId || booking.customer_id
      },
    }, {
      idempotencyKey: `session_${bookingId}`,
    })

    // 4. Update booking with session ID
    await supabaseClient
      .from("bookings")
      .update({
        stripe_session_id: session.id,
        payment_status: "pending_payment",
        status: "pending_payment"
      })
      .eq("id", bookingId)

    return jsonResponse({ sessionId: session.id, url: session.url }, 200, corsHeaders)
  } catch (error) {
    console.error(`[Stripe Checkout] ${error.message}`)
    return jsonResponse({ error: error.message }, 400, corsHeaders)
  }
})
