import {SBServer} from "./sb-server.module.js";

const mr_users_db = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "users",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
);
const logType = new URLSearchParams(window.location.search).get("q");
const logger = {
    form:  document.getElementById("logger"),
    name:  document.getElementById("name"),
    bName:  document.getElementById("bname"),
    bAcct:  document.getElementById("bacct"),
    pw:  document.getElementById("pw"),
    eye: document.getElementById("eye")
}
let PW_state = 0;

// Log Submission
logger.form.addEventListener("submit",async (e)=>{
    e.preventDefault();

    logger.form.innerHTML= `<img src="res/icons/load.png" class="spinner" width="100px">`;
    logger.form.style.display = 'flex';
    logger.form.style.justifyContent = "center";
    if (logType == "signup") {

        const check = await mr_users_db.get(`select=name,bank&name=eq.${cleanName(logger.name.value)}&bank=eq.${logger.bAcct.value}`)
        
        if(!check.length) {
            mr_users_db.post({
                name: cleanName(logger.name.value),
                bName: logger.bName.value,
                bank: logger.bAcct.value,
                pw: logger.pw.value,
                roth: 0
            }).then(async ()=>{
                const [req] = await mr_users_db.get(`select=id,pw&name=eq.${cleanName(logger.name.value)}&pw=eq.${logger.pw.value}`) 
                window.location.href = `app/index.html?id=${req.id}&pw=${req.pw}`;
            }).catch(()=>{
                logError();
            })
        } else {
            existedAcct();
        }
    } else if (logType == "login") {
        (async()=>{
            const [req] = await mr_users_db.get(`select=id,pw&name=eq.${cleanName(logger.name.value)}&pw=eq.${logger.pw.value}`).catch(()=>logError()) 
            if(req) {
                window.location.href = `app/index.html?id=${req.id}&pw=${req.pw}`;
            } else {
                unexistAcct();
            }
        })();
    }
});

if (logType == "signup") {
    document.getElementById("submit").innerHTML  = "Sign Up";
} else if (logType == "login") {
    document.getElementById("submit").innerHTML  = "Log In";
    logger.pw.placeholder = "Enter Your Password";
    document.getElementById("bank-in").remove();
};

globalThis.togglePW = ()=> {
    if(PW_state) {
        logger.pw.type = "password";
        logger.eye.src = "res/icons/eye-open.png"
    } else {
        logger.pw.type = "text"
        logger.eye.src = "res/icons/eye-close.png"
    };
    PW_state = !PW_state;
};

function logError() {
    setTimeout(() => {
        logger.form.style.display = 'inline';
        logger.form.innerHTML = `
        <label style="color: silver;">Something Went Wrong?</label>
        <br>
        <br>
        <label>Please Try Again</label>
        <br>
        <p style="text-align: center;">
            <button type="button" class="blue-btn" onclick="window.location.reload();">ReLog</button>
        </p>`
    }, 500);
}

function existedAcct() {
    setTimeout(() => {
        logger.form.style.display = 'inline';
        logger.form.innerHTML = `
        <label style="color: silver;">This Account already existed.</label>
        <br>
        <br>
        <label>Please Try Again</label>
        <br>
        <p style="text-align: center;">
            <button type="button" class="blue-btn" onclick="window.location.reload();">ReLog</button>
        </p>`
    }, 500);
}

function unexistAcct() {
    logger.form.style.display = 'inline';
    logger.form.innerHTML = `
    <label style="color: silver;">This Account Does Not Exist.</label>
    <br>
    <br>
    <label>Please Try Again</label>
    <br>
    <p style="text-align: center;">
        <button type="button" class="blue-btn" onclick="window.location.reload();">ReLog</button>
    </p>`
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