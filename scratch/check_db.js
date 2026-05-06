
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: "SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles'"
  });
  
  if (error) {
    // If execute_sql RPC doesn't exist, try a direct select
    const { data: sample, error: selectError } = await supabase.from('profiles').select('*').limit(1);
    if (selectError) {
      console.error('Error selecting from profiles:', selectError);
    } else {
      console.log('Columns in profiles:', Object.keys(sample[0] || {}));
    }
  } else {
    console.log('Columns:', data);
  }
}

checkColumns();
