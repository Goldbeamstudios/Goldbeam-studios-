
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qsnudsnqbpbmjbzwyqzr.supabase.co';
const supabaseAnonKey = 'sb_publishable_JdTlg9hDCTxlYn6MBRobbg_Og0UH_go';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
    console.log('--- STUDIOS ---');
    const { data: studios } = await supabase.from('studios').select('*');
    console.table(studios);

    for (const s of studios) {
        console.log(`\n--- ${s.name} (${s.id}) WORKING HOURS ---`);
        const { data: hours } = await supabase.from('studio_working_hours').select('*').eq('studio_id', s.id).order('day_of_week');
        console.table(hours);

        console.log(`\n--- ${s.name} (${s.id}) BLOCKED SLOTS ---`);
        const { data: slots } = await supabase.from('blocked_slots').select('*').eq('studio_id', s.id).order('day_of_week');
        console.table(slots);
    }
}

diagnose();
