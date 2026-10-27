import {SBServer} from "../../scripts/sb-server.module.js";
import MySweet from "../../scripts/mySweet.js";

const intructions = document.getElementById("instruct");
const uid = (new URLSearchParams(window.location.search)).get("uid");
const upadate_db = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "update",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
); 
const users_db = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "users",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
); 
let rothVal; 
const paystack = new window.PaystackPop();

startUp();

globalThis.moreInst =()=>{
    setTimeout(() => {
        intructions.innerHTML = 
        `<ul>
            <li>Dear users make sure you interact every ads to earn more.</li>
            <li>Make sure you turn off your Ad-blockers to recieve ads.</li>
            <li>Attention there is no fixed amount, you will get paid but in mind it's gonna worth trying out.</li>
            <li>And you need to press withdraw button to recieve money we pay systematically as you interact, it depends on your active.</li>
            <br>
            <button class="drop-btn" onclick="lessInst()">hide</button>
        </ul>`;      
    }, 200);
};

globalThis.lessInst =()=>{
    setTimeout(() => {
        intructions.innerHTML = 
        `<ul>
            <li>Dear users make sure you interact every ads to earn more.</li>
            <li>Make sure you turn off your Ad-blockers to recieve ads.</li>
            <br>
            <button class="drop-btn" onclick="moreInst()">see more</button>
        </ul>`;      
    }, 200);
};

globalThis.withdraw =()=>{
    MySweet.setTheme("light");
    setTimeout(() => {
        MySweet.alert("Auto-withdraw","We pay Automatically at a period of time, but we assure you that all your money will be given to you around 1 month.")
    }, 200);
};

const genEmail = `homer${uid}@mineroth.com`;
globalThis.deposit = ()=>{
    //MySweet.setTheme("light");
    setTimeout(async () => {
        const amt = await MySweet.choose("Deposit:",{
            times2: "NGN"+rothVal*2+" for 1 Roth",
            times4: "NGN"+rothVal*4+" for 3 Roth",
            times5: "NGN"+rothVal*5+" for 4 Roth",
            times10: "NGN"+rothVal*10+" for 9 Roth",
            times20: "NGN"+rothVal*20+" for 19 Roth",
        });
        if(amt) {
           confirmDeposit(amt);
        } else {
            MySweet.toast("Aborted Deposit")
        }
    }, 200);
};

function confirmDeposit(stk) {
    const multiplier = parseInt(stk.replace('times', ''))||1;
    const xx10Ng = (multiplier * rothVal);

    paystack.newTransaction({
        key: 'pk_live_54a5056e953c30da8ff333ccc0ff528065070ddf', 
        email: genEmail,
        amount: xx10Ng * 100,
        currency: 'NGN',
        channels: ["bank","card"],
        
        onSuccess: async (transc) => {
            const [{roth}] = await users_db.get('select=roth&id=eq.'+uid);
            await users_db.patch('id=eq.'+uid, {roth: roth + (multiplier-1)});
        },
        onCancel: () => {
          // Nothing
        }
    });
};

globalThis.gotoMine = ()=>{
    open("../mine/index.html?uid="+uid,"self",null,false);
};
globalThis.gotoSett = ()=>{
    window.location.href = "../sett/index.html?uid="+uid;
};
globalThis.gotoTrade = ()=>{
    window.location.href = "../trade/index.html?uid="+uid+"&val="+rothVal;
};
globalThis.gotoUpdates = ()=>{
    window.location.href = "../updates/index.html?uid="+uid;
};

async function startUp() {
    await users_db.patch("id=eq."+uid,{ lastUsed: (new Date()).toLocaleDateString() });
    const [update] = await upadate_db.get('limit=1');
    const [user] = await users_db.get(`id=eq.${uid}`)
    rothVal = ~~update.roth_val;

    document.getElementById('val0').innerHTML = 
    `<del class="ngn">N</del>${rothVal}`;
    document.getElementById('roth').innerHTML = user.roth;
    document.getElementById('ngn').innerHTML = 
    user.roth*rothVal;
    document.getElementById("ld-overlay").style.visibility = "hidden";

    
    // Bank Error informat
    if(user.bError) {
        const redBank = "<img src='../../res/icons/red-bank.png' width='30px' style='margin-right: 7px'>";
        MySweet.setTheme("danger");
        await MySweet.confirm(redBank+"Bank Error!","Dear User, We detected that you provided a invalid bank information. Please fix this or Mine-Roth will not pay your dues. Tips: Re-enter you bank details in the 'Settings'.")
        users_db.patch(`id=eq.${uid}`, {bError: null})
    }

    // Payeout
    if (user.payed) {
        const payout = "<img src='../../res/icons/payout.png' width='80px' style='margin-right: 7px'>";
        MySweet.setTheme("light");
        await MySweet.confirm(payout+"You have been Credited!","This is from Mine-Roth payouts. Please, User check your bank to confirm payments. <br><br><strong><small>Credited: NGN"+user.payed+"</small></strong>")
        users_db.patch(`id=eq.${uid}`, {payed: null, roth: 0})
    }
    
}
