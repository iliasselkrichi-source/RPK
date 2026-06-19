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

function isAllowedFleetConnectOrigin(origin: string | null) {
  if (!origin) return false
  if (ALLOWED_ORIGINS.includes(origin)) return true
  try {
    const url = new URL(origin)
    if (url.protocol !== "https:") return false
    return url.hostname === "fleetconnect.be" || url.hostname.endsWith(".fleetconnect.be")
  } catch (_) {
    return false
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
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return jsonResponse({ error: "Authentication required" }, 401, corsHeaders)
    }
    if (!Deno.env.get("SUPABASE_URL") || !Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || !Deno.env.get("SUPABASE_ANON_KEY")) {
      throw new Error("Supabase configuration is missing")
    }

    const { bookingId } = await req.json()
    if (!bookingId) {
      throw new Error("Missing bookingId")
    }

    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    )
    const { data: isOperator, error: operatorError } = await authClient.rpc("is_operator")
    if (operatorError || isOperator !== true) {
      return jsonResponse({ error: "Operator authorization required" }, 403, corsHeaders)
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // 1. Get booking and payment intent
    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select("stripe_payment_intent_id, amount")
      .eq("id", bookingId)
      .single()

    if (bookingError || !booking?.stripe_payment_intent_id) {
      throw new Error("Booking or payment intent not found")
    }

    // 2. Execute refund via Stripe
    const refund = await stripe.refunds.create({
      payment_intent: booking.stripe_payment_intent_id,
      metadata: {
        booking_id: bookingId
      }
    })

    // 3. Update database is handled by the webhook (charge.refunded)
    // but we can return success here

    return jsonResponse({ success: true, refundId: refund.id }, 200, corsHeaders)
  } catch (error) {
    console.error(`[Stripe Refund] ${error.message}`)
    return jsonResponse({ error: error.message }, 400, corsHeaders)
  }
})
