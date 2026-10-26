import {SBServer} from "../scripts/sb-server.module.js";
import MySweet from "../scripts/mySweet.js";
const kjHUgJgz = new SBServer(
"https://hqqykvvumlgoudkikmlx.supabase.co",
"update",
"sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
);
MySweet.setTheme('light');
const clothe = {
overlay: {backgroundColor: 'black',
backgroundImage: 'url(../res/splash.jpg)',backgroundRepeat: 'no-repeat',
backgroundSize:'80%'},
box: {boxShadow: '2px 2px 20px 5px black'}
};
async function openSecurity() {
const psc = await MySweet.prompt('<img src="../res/Icon.png" width="24px" style="margin-right:5px">Enter Admin passcode:','0 1 2 3 4',clothe);
const [{admin_key}] = await kjHUgJgz.get('select=admin_key&limit=1');
if(psc != admin_key) {document.write('Oops. ERR: 101')} else {
document.getElementById('secret').remove()};
};openSecurity();