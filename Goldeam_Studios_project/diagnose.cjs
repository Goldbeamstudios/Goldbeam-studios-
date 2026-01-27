
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qsnudsnqbpbmjbzwyqzr.supabase.co';
const supabaseAnonKey = 'sb_publishable_JdTlg9hDCTxlYn6MBRobbg_Og0UH_go';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
    try {
        console.log('--- STUDIOS ---');
        const { data: studios, error: sError } = await supabase.from('studios').select('*');
        if (sError) throw sError;
        console.table(studios);

        for (const s of studios) {
            console.log(`\n--- ${s.name} (${s.id}) WORKING HOURS ---`);
            const { data: hours, error: hError } = await supabase.from('studio_working_hours').select('*').eq('studio_id', s.id).order('day_of_week');
            if (hError) throw hError;
            console.table(hours.map(h => ({
                day: h.day_of_week,
                start: h.start_time,
                end: h.end_time,
                closed: h.is_closed
            })));

            console.log(`\n--- ${s.name} (${s.id}) BLOCKED SLOTS ---`);
            const { data: slots, error: slError } = await supabase.from('blocked_slots').select('*').eq('studio_id', s.id).order('day_of_week');
            if (slError) throw slError;
            console.table(slots.map(sl => ({
                day: sl.day_of_week,
                time: sl.slot_time,
                reason: sl.reason
            })));
        }
    } catch (e) {
        console.error('ERROR:', e.message);
    }
}

diagnose();
