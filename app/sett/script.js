import {SBServer} from "../../scripts/sb-server.module.js";
import MySweet from "../../scripts/mySweet.js";
import $ from "jquery";

MySweet.setTheme("light");

const fullName = $("#fullName");
const bankName = $("#bankName");
const accountNumber = $("#accountNumber");
const newPassword = $("#newPassword");
const confirmPassword = $("#confirmPassword");

fullName.val("Loading...");
bankName.val("Loading...");
accountNumber.val("Loading...");
newPassword.val("Loading...");
confirmPassword.val("Loading...");

const uid = (new URLSearchParams(window.location.search)).get("uid");
const users_db = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "users",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
);

startUp();

$("#form").on("submit",async e=>{
    e.preventDefault();

    if(newPassword.val() != confirmPassword.val()){
        await MySweet.alert("Passwords do not Match", "Please confirm passwords.");
    } else {
        $(".btn").text("Saving...");
        $(".btn").css("opacity",0.7);
    
        await users_db.patch("id=eq."+uid,{
            name: cleanName(fullName.val()),
            bName: bankName.val(),
            bank: accountNumber.val()
        });

        await users_db.patch("id=eq."+uid,{
            pw: newPassword.val()
        });

        window.location.reload();
    };
});

async function startUp() {
    const [credentials] = await users_db.get(`id=eq.${uid}&select=bName,bank,name,pw`).catch(async ()=>{
      await MySweet.alert("Error","Something went wrong, check your internet connection or try again later.");
      window.location.reload();  
    });
    fullName.val(credentials.name);
    bankName.val(credentials.bName);
    accountNumber.val(credentials.bank);
    newPassword.val(credentials.pw);
    confirmPassword.val(credentials.pw);
}

function cleanName(name = String()) {
    name = name.replace(/ +/g," ").toLowerCase();
    let res = "";

    if (name[name.length-1] == " ") {
        for(let i=0;i<name.length-1;i++){
            res += name[i];
        }
    } else {
        res = name
    };
    return res
}