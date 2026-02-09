import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { name, email, phone, message } = await req.json();

        // 1. Server-Side Validation & Sanitization
        if (!name || !email || !message) {
            throw new Error('Name, email, and message are required.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format.');
        }

        // NANP Phone Validation (matching BookWizard)
        const nanpRegex = /^(\+?1[-.\s]?)?\(?[2-9][0-9]{2}\)?[-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4}$/;
        if (phone && !nanpRegex.test(phone.trim())) {
            throw new Error('Invalid phone number format. Please use (555) 555-5555.');
        }

        // Basic Sanitization
        const cleanName = name.trim().replace(/[<>]/g, '');
        const cleanMessage = message.trim().replace(/[<>]/g, '');

        // 2. Persist to Database
        const { error: dbError } = await supabaseClient
            .from('contact_messages')
            .insert({
                name: cleanName,
                email: email.trim(),
                phone: phone ? phone.trim() : null,
                message: cleanMessage
            });

        if (dbError) throw dbError;

        // 3. Notify Admin via Resend
        const resendKey = Deno.env.get('RESEND_API_KEY');
        if (resendKey) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            const dateStr = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendKey}`
                },
                body: JSON.stringify({
                    from: 'Goldbeam Studios <contact@goldbeamstudios.com>',
                    to: 'contact@goldbeamstudios.com',
                    subject: `📩 New Message from ${cleanName}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden;">
                            <div style="background: #18181b; padding: 30px; text-align: center;">
                                <img src="https://qsnudsnqbpbmjbzwyqzr.supabase.co/storage/v1/object/public/logo/GoldBeam_Logo_PNG_06.png" alt="Goldbeam Studios" style="max-width: 150px;">
                                <h1 style="color: #f59e0b; margin-top: 20px; font-size: 20px; text-transform: uppercase;">New Contact Message</h1>
                            </div>
                            <div style="padding: 30px; background: #ffffff;">
                                <div style="margin-bottom: 25px;">
                                    <p style="color: #71717a; font-size: 12px; text-transform: uppercase; margin: 0 0 5px 0;">From</p>
                                    <p style="font-weight: bold; font-size: 18px; margin: 0;">${cleanName}</p>
                                    <p style="color: #52525b; margin: 5px 0 0 0;">${email} ${phone ? `• ${phone}` : ''}</p>
                                </div>
                                <div style="margin-bottom: 25px; padding: 20px; background: #fafafa; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                    <p style="color: #71717a; font-size: 12px; text-transform: uppercase; margin: 0 0 10px 0;">Message</p>
                                    <p style="line-height: 1.6; color: #18181b; margin: 0; white-space: pre-wrap;">${cleanMessage}</p>
                                </div>
                                <div style="font-size: 12px; color: #a1a1aa; border-top: 1px solid #e4e4e7; padding-top: 20px;">
                                    Submitted on ${dateStr} at ${timeStr}
                                </div>
                            </div>
                        </div>
                    `
                })
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
