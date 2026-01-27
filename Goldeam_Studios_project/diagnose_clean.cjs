
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qsnudsnqbpbmjbzwyqzr.supabase.co';
const supabaseAnonKey = 'sb_publishable_JdTlg9hDCTxlYn6MBRobbg_Og0UH_go';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
    const { data: studios } = await supabase.from('studios').select('*');
    for (const s of studios) {
        const { data: hours } = await supabase.from('studio_working_hours').select('*').eq('studio_id', s.id).order('day_of_week');
        console.log(`Studio ${s.name}:`);
        hours.forEach(h => {
            console.log(`  Day ${h.day_of_week}: ${h.start_time} - ${h.end_time} ${h.is_closed ? '(CLOSED)' : ''}`);
        });
    }
}
diagnose();
