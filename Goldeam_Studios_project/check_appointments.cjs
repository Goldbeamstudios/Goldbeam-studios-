
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qsnudsnqbpbmjbzwyqzr.supabase.co';
const supabaseAnonKey = 'sb_publishable_JdTlg9hDCTxlYn6MBRobbg_Og0UH_go';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAppointments() {
    console.log('--- RECENT APPOINTMENTS ---');
    const { data, error } = await supabase
        .from('appointments')
        .select('id, customer_name, studio, booking_date, start_time, duration_hours, booking_range, status')
        .order('booking_date', { ascending: false })
        .limit(10);

    if (error) console.error(error);
    else console.table(data);
}

checkAppointments();
