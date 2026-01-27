import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from "https://esm.sh/stripe@18.5.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: "2024-11-20.acacia"
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

serve(async (req) => {
    const signature = req.headers.get('stripe-signature')

    if (!signature || !webhookSecret) {
        return new Response('Webhook secret or signature missing', { status: 400 })
    }

    try {
        const body = await req.text()
        const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)

        // DEBUG: Log every event received
        const supabaseClientForLog = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        await supabaseClientForLog.from('webhook_errors').insert({
            event_type: event.type,
            error_message: 'Event Received',
            payload: event.data.object
        });

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session
            const metadata = session.metadata

            if (!metadata) {
                throw new Error('No metadata found in session')
            }

            // 1. Initialize Supabase Client
            const supabaseClient = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            )

            try {
                // 2. Create Booking in Database
                const { data: booking, error: dbError } = await supabaseClient
                    .from('appointments')
                    .insert({
                        stripe_session_id: session.id,
                        stripe_payment_intent_id: session.payment_intent as string,
                        customer_name: metadata.customerName,
                        customer_email: metadata.customerEmail,
                        plan_type: metadata.plan,
                        studio: metadata.studio,
                        studio_id: metadata.studio_id,
                        theme: metadata.theme || null,
                        duration_hours: parseInt(metadata.duration),
                        addons: JSON.parse(metadata.addons || '[]'),
                        total_price: (session.amount_total || 0) / 100,
                        booking_date: metadata.date,
                        start_time: metadata.time,
                        status: 'confirmed'
                    })
                    .select()
                    .single()

                if (dbError) {
                    console.error('Database Error:', dbError);
                    // Log to error table
                    await supabaseClient.from('webhook_errors').insert({
                        event_type: event.type,
                        error_message: `DB Insert Failed: ${dbError.message}`,
                        payload: { session, metadata, dbError }
                    });
                    throw dbError;
                }

                // 3. Send Notification to Owner
                await supabaseClient.functions.invoke('send-notification', {
                    body: {
                        to: 'info@goldbeamstudios.com',
                        subject: 'New Paid Booking - Goldbeam Studios',
                        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://qsnudsnqbpbmjbzwyqzr.supabase.co/storage/v1/object/public/blog-images/logo.png" alt="Goldbeam Studios" style="max-width: 150px;">
                    </div>
                    <h1 style="color: #000; text-align: center; font-size: 22px;">New Booking Confirmed!</h1>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-top: 20px;">
                        <p><strong>Customer:</strong> ${metadata.customerName}</p>
                        <p><strong>Email:</strong> ${metadata.customerEmail}</p>
                        <p><strong>Session:</strong> ${metadata.plan} - Studio ${metadata.studio}</p>
                        <p><strong>Date:</strong> ${metadata.date} at ${metadata.time}</p>
                        <p><strong>Duration:</strong> ${metadata.duration} hour(s)</p>
                        <p><strong>Total Paid:</strong> $${(session.amount_total || 0) / 100}</p>
                    </div>
                </div>
              `
                    }
                })

                // 4. Send Confirmation to Customer
                await supabaseClient.functions.invoke('send-notification', {
                    body: {
                        to: metadata.customerEmail,
                        subject: 'Booking Confirmed - Goldbeam Studios',
                        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://qsnudsnqbpbmjbzwyqzr.supabase.co/storage/v1/object/public/blog-images/logo.png" alt="Goldbeam Studios" style="max-width: 150px;">
                    </div>
                    <h1 style="color: #000;">Hi ${metadata.customerName},</h1>
                    <p>Your session at Goldbeam Studios has been confirmed and paid!</p>
                    <div style="background: #000; color: #fff; padding: 25px; border-radius: 12px; margin: 25px 0;">
                        <p style="margin: 8px 0; border-bottom: 1px solid #333; pb-8px;"><strong>Studio:</strong> Studio ${metadata.studio}</p>
                        <p style="margin: 8px 0; border-bottom: 1px solid #333; pb-8px;"><strong>Date:</strong> ${metadata.date}</p>
                        <p style="margin: 8px 0; border-bottom: 1px solid #333; pb-8px;"><strong>Time:</strong> ${metadata.time}</p>
                        <p style="margin: 8px 0;"><strong>Duration:</strong> ${metadata.duration} hour(s)</p>
                    </div>
                    <p style="text-align: center; color: #666; font-style: italic;">We look forward to seeing you at the studio!</p>
                </div>
              `
                    }
                })
            } catch (innerError: any) {
                console.error('Processing Error:', innerError);
                // Ensure the error is logged even if it's not a DB error
                await supabaseClient.from('webhook_errors').insert({
                    event_type: event.type,
                    error_message: innerError.message || String(innerError),
                    payload: { session, metadata }
                });
                throw innerError;
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (err: any) {
        console.error(`Webhook Root Error: ${err.message || String(err)}`)
        // Fallback logging for root level errors (e.g. signature verification)
        try {
            const supabaseClient = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            )
            await supabaseClient.from('webhook_errors').insert({
                error_message: `Root Level Error: ${err.message || String(err)}`,
                payload: { headers: Object.fromEntries(req.headers.entries()) }
            });
        } catch (logErr) {
            console.error('Failed to log error to database:', logErr);
        }
        return new Response(`Webhook Error: ${err.message || String(err)}`, { status: 400 })
    }
})
