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

            // Helper to format 24h time to 12h AM/PM
            const formatTime12h = (time24: string) => {
                if (!time24) return 'N/A';
                try {
                    const [hours, minutes] = time24.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const hour12 = hour % 12 || 12;
                    return `${hour12}:${minutes} ${ampm}`;
                } catch (e) {
                    return time24;
                }
            };

            // Definitive Fix: Call Resend API directly to bypass 401 Gateway errors
            const notify = async (payload: { to: string, subject: string, html: string }) => {
                const resendKey = Deno.env.get('RESEND_API_KEY');
                if (!resendKey) {
                    console.error('RESEND_API_KEY is not set');
                    return;
                }

                try {
                    const response = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${resendKey}`
                        },
                        body: JSON.stringify({
                            from: 'Goldbeam Studios <contact@goldbeamstudios.com>',
                            to: payload.to,
                            subject: payload.subject,
                            html: payload.html
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error(`Direct Resend failed (${payload.to}):`, errorData);
                        await supabaseClient.from('webhook_errors').insert({
                            event_type: event.type,
                            error_message: `Resend HTTP ${response.status}: ${JSON.stringify(errorData)}`,
                            payload: { to: payload.to }
                        });
                    } else {
                        console.log(`Direct email sent to ${payload.to}`);
                    }
                } catch (fetchErr: any) {
                    console.error('Resend fetch error:', fetchErr);
                    await supabaseClient.from('webhook_errors').insert({
                        event_type: event.type,
                        error_message: `Resend Fetch Error: ${fetchErr.message}`,
                        payload: { to: payload.to }
                    });
                }
            };

            try {
                // 2. Create Booking in Database
                const { data: booking, error: dbError } = await supabaseClient
                    .from('appointments')
                    .insert({
                        stripe_session_id: session.id,
                        stripe_payment_intent_id: session.payment_intent as string,
                        customer_name: metadata.customerName,
                        customer_email: metadata.customerEmail,
                        customer_phone: metadata.customerPhone,
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
                    await supabaseClient.from('webhook_errors').insert({
                        event_type: event.type,
                        error_message: `DB Insert Failed: ${dbError.message}`,
                        payload: { session, metadata, dbError }
                    });
                    throw dbError;
                }

                // 3. Send Notification to Owner
                await notify({
                    to: 'contact@goldbeamstudios.com',
                    subject: '🚨 New Paid Booking - Goldbeam Studios',
                    html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #18181b;">
                <div style="background: #18181b; padding: 40px 20px; text-align: center; border-radius: 20px 20px 0 0;">
                    <img src="https://qsnudsnqbpbmjbzwyqzr.supabase.co/storage/v1/object/public/logo/GoldBeam_Logo_PNG_06.png" alt="Goldbeam Studios" style="max-width: 180px;">
                    <h1 style="color: #f59e0b; margin-top: 20px; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">New Paid Booking</h1>
                </div>
                
                <div style="background: #ffffff; padding: 30px; border: 1px solid #e4e4e7; border-top: none; border-radius: 0 0 20px 20px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #71717a; margin-bottom: 20px; border-bottom: 2px solid #f59e0b; display: inline-block;">Client Information</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr>
                            <td style="padding: 10px 0; color: #71717a; width: 30%;">Name</td>
                            <td style="padding: 10px 0; font-weight: bold;">${metadata.customerName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #71717a;">Email</td>
                            <td style="padding: 10px 0; font-weight: bold;">${metadata.customerEmail}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #71717a;">Phone</td>
                            <td style="padding: 10px 0; font-weight: bold; color: #f59e0b;">${metadata.customerPhone || 'N/A'}</td>
                        </tr>
                    </table>

                    <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #71717a; margin-bottom: 20px; border-bottom: 2px solid #f59e0b; display: inline-block;">Session Details</h2>
                    <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 12px;">
                        <tr>
                            <td style="padding: 20px;">
                                <p style="margin: 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Studio & Plan</p>
                                <p style="margin: 5px 0 0; font-weight: 900; font-size: 18px;">Studio ${metadata.studio} — ${metadata.plan.replace('_', ' ').toUpperCase()}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 20px 20px;">
                                <div style="display: inline-block; margin-right: 30px;">
                                    <p style="margin: 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Date</p>
                                    <p style="margin: 5px 0 0; font-weight: bold;">${metadata.date}</p>
                                </div>
                                <div style="display: inline-block; margin-right: 30px;">
                                    <p style="margin: 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Time</p>
                                    <p style="margin: 5px 0 0; font-weight: bold;">${formatTime12h(metadata.time)}</p>
                                </div>
                                <div style="display: inline-block;">
                                    <p style="margin: 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Duration</p>
                                    <p style="margin: 5px 0 0; font-weight: bold;">${metadata.duration} Hour(s)</p>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #e4e4e7; text-align: right;">
                        <p style="margin: 0; color: #71717a; font-size: 12px;">Total Paid (CAD)</p>
                        <p style="margin: 5px 0 0; color: #f59e0b; font-size: 32px; font-weight: 900;">$${(session.amount_total || 0) / 100}</p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 30px; color: #a1a1aa; font-size: 12px;">
                    <p>© 2026 Goldbeam Studios. Automated Alert System.</p>
                </div>
            </div>
          `
                });

                // 4. Send Confirmation to Customer
                await notify({
                    to: metadata.customerEmail,
                    subject: '✨ Booking Confirmed - Goldbeam Studios',
                    html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #18181b;">
                <div style="background: #18181b; padding: 50px 20px; text-align: center; border-radius: 24px 24px 0 0;">
                    <img src="https://qsnudsnqbpbmjbzwyqzr.supabase.co/storage/v1/object/public/logo/GoldBeam_Logo_PNG_06.png" alt="Goldbeam Studios" style="max-width: 180px;">
                    <h1 style="color: #ffffff; margin-top: 25px; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px;">You're Booked!</h1>
                    <p style="color: #f59e0b; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; margin-top: 10px;">Session Confirmed & Paid</p>
                </div>

                <div style="background: #ffffff; padding: 40px; border: 1px solid #e4e4e7; border-top: none; border-radius: 0 0 24px 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                    <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px;">Hi <strong>${metadata.customerName}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.6; color: #52525b; margin-bottom: 30px;">Your creative session at Goldbeam Studios is officially on the calendar. We've received your payment and our engineers are preparing for your arrival.</p>

                    <div style="background: #18181b; color: #ffffff; padding: 30px; border-radius: 20px; margin-bottom: 30px;">
                        <h3 style="color: #f59e0b; margin-top: 0; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Session Itinerary</h3>
                        <div style="margin-top: 20px;">
                            <div style="margin-bottom: 15px; border-bottom: 1px solid #27272a; padding-bottom: 15px;">
                                <span style="color: #71717a; font-size: 12px; text-transform: uppercase; display: block;">Location</span>
                                <span style="font-size: 18px; font-weight: bold;">Studio ${metadata.studio}</span>
                            </div>
                            <div style="margin-bottom: 15px; border-bottom: 1px solid #27272a; padding-bottom: 15px;">
                                <span style="color: #71717a; font-size: 12px; text-transform: uppercase; display: block;">Date & Time</span>
                                <span style="font-size: 18px; font-weight: bold;">${metadata.date} @ ${formatTime12h(metadata.time)}</span>
                            </div>
                            <div>
                                <span style="color: #71717a; font-size: 12px; text-transform: uppercase; display: block;">Duration</span>
                                <span style="font-size: 18px; font-weight: bold;">${metadata.duration} Hour Session</span>
                            </div>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 40px;">
                        <a href="https://goldbeamstudios.com" style="background: #f59e0b; color: #000000; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; display: inline-block;">Visit Our Website</a>
                    </div>

                    <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #e4e4e7; text-align: center;">
                        <p style="color: #71717a; font-size: 14px; margin-bottom: 20px;">Need to make changes? Reply to this email or visit our website.</p>
                        <div style="color: #18181b; font-weight: bold; font-size: 14px;">
                            Goldbeam Studios<br>
                            <span style="color: #f59e0b; font-size: 12px;">CREATIVE EXCELLENCE DEFINED</span>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px; color: #a1a1aa; font-size: 12px;">
                    <p>Sent with ❤️ from Toronto, Canada</p>
                </div>
            </div>
          `
                });
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
