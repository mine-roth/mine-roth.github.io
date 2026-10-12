const supabaseUrl = '"https://hqqykvvumlgoudkikmlx.supabase.co"';
const supabaseKey = 'sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs';

async function getFirstItem() {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/update?select=*&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const firstItem = data[0] || null;
    console.log('First item:', firstItem);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

getFirstItem();
