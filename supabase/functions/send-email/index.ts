import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { trigger, bookingId, booking, metadata } = await req.json()

    // Determine subject and content based on trigger
    let subject = `Fleetconnect - Update for ${bookingId}`
    let html = `<p>Hello ${booking.name},</p>`

    if (trigger === 'BOOKING_CONFIRMATION') {
        subject = `Bevestiging van uw boeking ${bookingId}`
        html += `<p>Bedankt voor uw boeking. We hebben uw aanvraag goed ontvangen.</p>`
    } else if (trigger === 'BOOKING_ACCEPTED') {
        subject = `Uw boeking ${bookingId} is geaccepteerd`
        html += `<p>Uw boeking is door ons geaccepteerd en wordt nu verwerkt.</p>`
    } else if (trigger === 'DRIVER_ASSIGNED') {
        subject = `Chauffeur toegewezen voor uw rit ${bookingId}`
        html += `<p>Er is een chauffeur toegewezen voor uw rit. De chauffeur zal op de afgesproken tijd aanwezig zijn.</p>`
        if (booking.driver) {
            html += `<p><strong>Chauffeur:</strong> ${booking.driver.name}<br><strong>Voertuig:</strong> ${booking.driver.vehicle} (${booking.driver.license_plate})</p>`
        }
    } else if (trigger === 'COMPLETED') {
        subject = `Bedankt voor uw rit bij Fleetconnect (${bookingId})`
        html += `<p>We hopen dat u een fijne rit heeft gehad. Bedankt voor het vertrouwen in Fleetconnect!</p>`
    }

    html += `<p><strong>Ritgegevens:</strong><br>
    Datum: ${booking.datetime}<br>
    Tijd: ${booking.time}<br>
    Pickup: ${booking.pickup}<br>
    Bestemming: ${booking.destination}</p>`

    const { data, error } = await resend.emails.send({
      from: 'FleetConnect <fleetconnect.os@gmail.com>',
      to: [booking.email],
      subject: subject,
      html: html,
      reply_to: 'fleetconnect.os@gmail.com'
    })

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
