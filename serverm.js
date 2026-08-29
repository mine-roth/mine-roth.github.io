// scripts/script.js

async function runTask() {
    try {
      const response = await fetch("https://hqqykvvumlgoudkikmlx.supabase.co/rest/v1/update?select=id&limit=1", {
        headers: {
          "apikey": "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs",
          "Authorization": "Bearer sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
        }
      });
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        process.exit(1); // Fail workflow if Supabase returns 400/401/500
      }
  
      const data = await response.json();
      console.log("Fetch successful:", data);
  
      process.exit(0); // Success exit
    } catch (error) {
      console.error("Network or script error:", error);
      process.exit(1); // Fail workflow if network breaks
    }
  }
  
  runTask();
