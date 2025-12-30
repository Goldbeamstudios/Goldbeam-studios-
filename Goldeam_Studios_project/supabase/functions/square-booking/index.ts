import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN')
const SQUARE_ENVIRONMENT = Deno.env.get('SQUARE_ENVIRONMENT') || 'sandbox'
const BASE_URL = SQUARE_ENVIRONMENT === 'sandbox'
    ? 'https://connect.squareupsandbox.com/v2'
    : 'https://connect.squareup.com/v2'

console.log(`Square Environment: ${SQUARE_ENVIRONMENT}`)
console.log(`Token present: ${!!SQUARE_ACCESS_TOKEN}`)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { appointment_data } = await req.json()
        const { customer, booking } = appointment_data

        // 1. Create or get customer in Square
        const customerResponse = await fetch(`${BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                given_name: customer.name,
                email_address: customer.email
            })
        })

        const customerData = await customerResponse.json()
        let squareCustomerId = customerData?.customer?.id
        let searchData = null

        if (!squareCustomerId) {
            console.error('Square Customer Creation Error:', JSON.stringify(customerData))
            // Try to search if email exists
            const searchResponse = await fetch(`${BASE_URL}/customers/search`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: { filter: { email_address: { exact: customer.email } } }
                })
            })
            searchData = await searchResponse.json()
            squareCustomerId = searchData?.customers?.[0]?.id
            if (!squareCustomerId) {
                console.error('Square Customer Search Error:', JSON.stringify(searchData))
            }
        }

        if (!squareCustomerId) {
            const finalError = customerData?.errors?.[0]?.detail || searchData?.errors?.[0]?.detail || 'Square Customer ID could not be created or found.'
            throw new Error(finalError)
        }

        // 2. Create Booking in Square
        // Extract fields that must go into appointment_segments
        const { service_variation_id, duration_minutes, team_member_id, ...restBooking } = booking;

        // CRITICAL: Square requires team_member_id
        if (!team_member_id) {
            throw new Error('Team member ID is required. Please set up at least one team member in your Square Sandbox Dashboard under Team > Add Team Member, and enable booking permissions.')
        }

        const bookingBody = {
            idempotency_key: crypto.randomUUID(),
            booking: {
                ...restBooking, // location_id, start_at
                customer_id: squareCustomerId,
                appointment_segments: [
                    {
                        service_variation_id: service_variation_id,
                        duration_minutes: duration_minutes || 60,
                        team_member_id: team_member_id
                    }
                ]
            }
        }

        const bookingResponse = await fetch(`${BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingBody)
        })

        const bookingData = await bookingResponse.json()

        return new Response(JSON.stringify(bookingData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: bookingResponse.status
        })
    } catch (error) {
        console.error('Edge Function Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        })
    }
})
