import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET"
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const requestBody = await req.text();
        const { booking_data } = JSON.parse(requestBody);
        const {
            plan,
            studio,
            studio_id,
            theme,
            duration,
            addons,
            date,
            time,
            customerName,
            customerEmail,
            customerPhone,
        } = booking_data

        console.log(`=== CHECKOUT STARTED FOR ${customerEmail} ===`);

        // 1. Calculate Total Price on Backend
        const calculateBackendTotal = () => {
            let baseRate = 0;
            if (plan === 'audio') baseRate = 170;
            else if (plan === 'audio_video') baseRate = studio === 'A' ? 300 : 250;
            else if (plan === 'general') baseRate = studio === 'A' ? 250 : 200;

            let discount = 0;
            if (duration === 2) discount = 0.20;
            else if (duration === 3) discount = 0.25;
            else if (duration === 4) discount = 0.30;
            else if (duration === 5) discount = 0.32;
            else if (duration === 6) discount = 0.34;
            else if (duration === 7) discount = 0.36;
            else if (duration >= 8) discount = 0.40;

            const discountedStudioTotal = (baseRate * duration) * (1 - discount);

            const ADD_ONS_DATA = [
                { id: 'iso', price: 75, hourly: true },
                { id: 'basic_edit', price: 75, hourly: false },
                { id: 'advanced_edit', price: 250, hourly: false },
                { id: 'mastering', price: 60, hourly: false },
                { id: 'clips', price: 90, hourly: false },
                { id: 'notes', price: 30, hourly: false },
                { id: 'teleprompter', price: 50, hourly: false },
                { id: 'monitor', price: 50, hourly: false },
                { id: 'live_stream', price: 75, hourly: true },
            ];

            const selectedAddons = ADD_ONS_DATA.filter(a => addons.includes(a.id));
            const hourlyAddonsTotal = selectedAddons.filter(a => a.hourly).reduce((s, a) => s + a.price, 0) * duration;
            const flatAddonsTotal = selectedAddons.filter(a => !a.hourly).reduce((s, a) => s + a.price, 0);

            return discountedStudioTotal + hourlyAddonsTotal + flatAddonsTotal;
        };

        const finalPrice = calculateBackendTotal();
        console.log(`Calculated total price: ${finalPrice} CAD`);

        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || '', {
            apiVersion: "2024-11-20.acacia"
        });

        // 2. Initialize Supabase Client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 3. Robust Availability Check (Backend Validation) using tsrange
        // Format: YYYY-MM-DD HH:mm:ss
        const startTs = `${date} ${time.length === 5 ? time + ':00' : time}`;
        const endTsDate = new Date(new Date(`${date}T${time}:00`).getTime() + duration * 60 * 60 * 1000);
        const endTs = `${endTsDate.toISOString().split('T')[0]} ${endTsDate.toTimeString().split(' ')[0]}`;

        console.log(`Checking availability for range: [${startTs}, ${endTs})`);

        const { data: existing, error: checkError } = await supabaseClient
            .from('appointments')
            .select('id')
            .eq('studio_id', studio_id)
            .neq('status', 'cancelled') // Prevent even pending overlaps
            .filter('booking_range', 'ov', `[${startTs}, ${endTs})`)
            .maybeSingle()

        if (checkError) {
            console.error('Availability check failed:', checkError);
            throw new Error(`Availability check error: ${checkError.message}`);
        }

        if (existing) {
            console.warn('Blocking checkout: Slot already taken.');
            return new Response(JSON.stringify({ error: 'This time slot is no longer available.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // 4. Create Stripe Checkout Session
        console.log('Creating Stripe Session...');
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: customerEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'cad',
                        product_data: {
                            name: `${plan.toUpperCase()} Session - Studio ${studio}`,
                            description: `${duration} hour(s) on ${date} at ${time}. ${addons.length > 0 ? `Add-ons: ${addons.join(', ')}` : ''}`,
                        },
                        unit_amount: Math.round(finalPrice * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/book-wizard`,
            metadata: {
                plan,
                studio,
                studio_id,
                theme,
                duration: duration.toString(),
                addons: JSON.stringify(addons),
                date,
                time,
                customerName,
                customerEmail,
                customerPhone,
            },
        })

        console.log(`Success: Session created - ${session.id}`);

        return new Response(JSON.stringify({ id: session.id, url: session.url }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        console.error('Edge Function Catch Block:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
