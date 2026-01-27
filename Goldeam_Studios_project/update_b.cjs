
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qsnudsnqbpbmjbzwyqzr.supabase.co';
const supabaseAnonKey = 'sb_publishable_JdTlg9hDCTxlYn6MBRobbg_Og0UH_go';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function forceUpdateB() {
    try {
        console.log('Fetching Studio B ID...');
        const { data: studios, error: sError } = await supabase.from('studios').select('id').eq('name', 'B').single();
        if (sError) throw sError;
        const studioId = studios.id;

        console.log(`Updating Studio B (${studioId}) to 7 AM - 9 PM...`);
        const { data, error } = await supabase
            .from('studio_working_hours')
            .update({ start_time: '07:00:00', end_time: '21:00:00', is_closed: false })
            .eq('studio_id', studioId);

        if (error) throw error;
        console.log('SUCCESS: Studio B updated.');

        console.log('\nVerifying...');
        const { data: result } = await supabase.from('studio_working_hours').select('day_of_week, start_time, end_time').eq('studio_id', studioId).order('day_of_week');
        console.table(result);
    } catch (e) {
        console.error('FAILED:', e.message);
    }
}

forceUpdateB();
