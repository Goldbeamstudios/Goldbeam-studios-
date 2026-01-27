import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET"
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { to, template_name, variables, appointment_id } = await req.json()
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // 1. Fetch Template
        const { data: template, error: tempError } = await supabase
            .from('email_templates')
            .select('*')
            .eq('name', template_name)
            .single()

        if (tempError || !template) throw new Error(`Template ${template_name} not found`)

        // 2. Variable Substitution
        let html = template.html_content
        let subject = template.subject

        Object.entries(variables || {}).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g')
            html = html.replace(regex, String(value))
            subject = subject.replace(regex, String(value))
        })

        // 3. Send Email via Resend
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Goldbeam Studios <bookings@goldbeamstudios.com>',
                to,
                subject,
                html
            })
        })

        const resData = await response.json()

        // 4. Log Email
        await supabase.from('email_logs').insert({
            recipient: to,
            template_id: template.id,
            appointment_id: appointment_id || null,
            status: response.ok ? 'sent' : 'failed',
            error_message: response.ok ? null : JSON.stringify(resData)
        })

        return new Response(JSON.stringify(resData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        })
    }
})
