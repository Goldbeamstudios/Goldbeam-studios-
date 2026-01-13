-- Ensure the booking_reminder template exists
INSERT INTO public.email_templates (name, subject, html_content, variables)
VALUES (
    'booking_reminder',
    'Reminder: Your Recording Session at Goldbeam Studios',
    '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #000;">Session Reminder</h2>
        <p>Hi <strong>{{customer_name}}</strong>,</p>
        <p>This is a friendly reminder for your upcoming recording session at Goldbeam Studios.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date:</strong> {{booking_date}}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> {{start_time}} EST</p>
            <p style="margin: 5px 0;"><strong>Studio:</strong> {{studio}}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> {{duration}} Hour(s)</p>
        </div>

        <p>Please arrive 10-15 minutes early to settle in. If you need to reschedule or have any questions, please contact us immediately.</p>
        
        <p>We look forward to seeing you!</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">Goldbeam Studios | Professional Podcast & Content Creation Space</p>
    </div>
</body>
</html>',
    '["customer_name", "booking_date", "start_time", "studio", "duration"]'::jsonb
)
ON CONFLICT (name) DO UPDATE 
SET subject = EXCLUDED.subject, 
    html_content = EXCLUDED.html_content;
