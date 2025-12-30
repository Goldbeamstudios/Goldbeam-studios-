import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN')
const SQUARE_ENVIRONMENT = Deno.env.get('SQUARE_ENVIRONMENT') || 'sandbox'
const BASE_URL = SQUARE_ENVIRONMENT === 'sandbox'
    ? 'https://connect.squareupsandbox.com/v2'
    : 'https://connect.squareup.com/v2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const response = await fetch(`${BASE_URL}/catalog/list?types=APPOINTMENTS_SERVICE`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })

        // Also fetch bookable team members
        const teamResponse = await fetch(`${BASE_URL}/bookings/team-member-booking-profiles`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        const teamData = await teamResponse.json()

        // Simplify the output for the user
        const services = data.objects?.map((obj: any) => ({
            name: obj.item_data.name,
            service_id: obj.id,
            variation_id: obj.item_data.variations?.[0]?.id,
            price: obj.item_data.variations?.[0]?.item_variation_data?.price_money?.amount
        })) || []

        const teamMemberId = teamData.team_member_booking_profiles?.[0]?.team_member_id

        return new Response(JSON.stringify({ services, teamMemberId }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        })
    }
})
