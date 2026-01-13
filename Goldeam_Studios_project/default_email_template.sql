-- Ensure the booking_reminder template exists
INSERT INTO public.email_templates (name, subject, html_content, variables)
VALUES (
    'booking_reminder',
    'Reminder: Your Recording Session at Goldbeam Studios',
    '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #ddd; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="{{logo_url}}" alt="Goldbeam Studios" style="max-width: 180px; height: auto;">
        </div>
        
        <h2 style="color: #000; text-align: center; font-size: 24px; margin-bottom: 20px;">Session Reminder</h2>
        <p>Hi <strong>{{customer_name}}</strong>,</p>
        <p>This is a friendly reminder for your upcoming recording session at Goldbeam Studios.</p>
        
        <div style="background: #000; color: #fff; padding: 25px; border-radius: 12px; margin: 25px 0;">
            <p style="margin: 8px 0; border-bottom: 1px solid #333; pb-8px;"><strong>Date:</strong> {{booking_date}}</p>
            <p style="margin: 8px 0; border-bottom: 1px solid #333; pb-8px;"><strong>Time:</strong> {{start_time}} EST</p>
            <p style="margin: 8px 0; border-bottom: 1px solid #333; pb-8px;"><strong>Studio:</strong> {{studio}}</p>
            <p style="margin: 8px 0;"><strong>Duration:</strong> {{duration}} Hour(s)</p>
        </div>

        <p style="text-align: center; font-style: italic; color: #666;">Please arrive 10-15 minutes early to settle in.</p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://goldbeamstudios.com" style="background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Visit Our Website</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">Goldbeam Studios | 123 Studio Way, Creative District</p>
    </div>
</body>
</html>',
    '["customer_name", "booking_date", "start_time", "studio", "duration", "logo_url"]'::jsonb
)
ON CONFLICT (name) DO UPDATE 
SET subject = EXCLUDED.subject, 
    html_content = EXCLUDED.html_content;
