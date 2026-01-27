
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qsnudsnqbpbmjbzwyqzr.supabase.co';
const supabaseAnonKey = 'sb_publishable_JdTlg9hDCTxlYn6MBRobbg_Og0UH_go';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAll() {
    console.log('--- ALL APPOINTMENTS ---');
    const { data, error, count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact' });

    if (error) console.error(error);
    else {
        console.log(`Total count: ${count}`);
        console.table(data);
    }
}

checkAll();
