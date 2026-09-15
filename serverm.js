import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hqqykvvumlgoudkikmlx.supabase.co";
const supabaseKey = "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs";

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_KEY environment variable is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTask() {
  // Executes a real query to trigger PostgreSQL engine activity
  const { data, error } = await supabase
    .from('update')
    .select('id')
    .limit(1);

  if (error) {
    throw error;
  }

  console.log('Successfully queried database:', data);
}

runTask().catch((err) => {
  console.error('Network or script error:', err);
  process.exit(1);
});
