// scripts/script.js

async function runTask() {
    try {
      const response = await fetch("https://wagiunkbuiylyjplirba.supabase.co/rest/v1/students?select=id&limit=1", {
        headers: {
          "apikey": "sb_publishable_fSW0HQ2Swg8p4XzTHAKlRA_VjShom-J",
          "Authorization": "Bearer sb_publishable_fSW0HQ2Swg8p4XzTHAKlRA_VjShom-J"
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