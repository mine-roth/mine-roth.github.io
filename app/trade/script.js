import MySweet from "../../scripts/mySweet.js";
import $ from "jquery";
import {SBServer} from "../../scripts/sb-server.module.js";


const uid = (new URLSearchParams(window.location.search)).get("uid");
const rothVal = (new URLSearchParams(window.location.search)).get("val");
const users_db = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "users",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
); 
const traders_db = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "traders",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
); 
const market_sv = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "market",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
); 
const paystack = new window.PaystackPop();

const chart = document.getElementById("chart");
const ctx = chart.getContext("2d");
chart.width = innerWidth;
chart.height = innerWidth;

const predicts = document.getElementsByClassName("prd");
const rothOut = $("#roth");
const userRef = $("#ref");
const analyt= $("#analyt");

startUp();

async function startUp() {
    const [trader] = await users_db.get("select=roth,name&id=eq."+uid)
    .catch(async()=>{
        await MySweet.alert("Something went wrong","The Trade board will have to reload.");
        location.reload();
    });

    if(await traders_db.count('from=eq.'+uid)) {
        console.log('existed')
    } else {
        console.log('created')
        await traders_db.post({from: uid});
    }

    rothOut.text(trader.roth+" Roth");
    userRef.text(trader.name+" is now trading.");
    analyt.text('market-opened.')
    for(let el of predicts) el.disabled = false;

};

const genEmail = `trader${uid}@mineroth.com`;
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
            await users_db.patch('id=eq.'+uid, {roth: roth + (multiplier-1) });
        },
        onCancel: () => {
            // Nothing
        }
    });
}

globalThis.bid = async (type)=> {
    let [{roth}] = await users_db.get('select=roth&id=eq.'+uid);
    if(type=='high') {
        await users_db.patch("id=eq."+uid,{roth: roth-1});
        await traders_db.patch('from=eq.'+uid,{bid: 'high'});
        rothOut.html((roth-1)+' Roth');
        MySweet.toast('HIGH -1Roth'); 
    } else if (type=='low') {
        await users_db.patch("id=eq."+uid,{roth: roth-1});
        await traders_db.patch('from=eq.'+uid,{bid: 'low'});
        rothOut.html((roth-1)+' Roth');
        MySweet.toast('LOW -1Roth'); 
    };
};

let fms;
let levels=[];
let Yaxis = 0;
init();
async function init() {
    const [fg] = await market_sv.get('select=bridge&limit=1');
    if(fg.bridge=='opened') {
        update();
    } else {
        await MySweet.alert('The Market is closed for now',' Try again some other day');
        history.back();
    }
}
async function update() {
    const [am] = await market_sv.get('select=profit,state,bridge&limit=1');
    const [ji] = await traders_db.get('from=eq.'+uid);
    if(am.bridge=="opened") {
        ctx.clearRect(0,0,chart.width,chart.height);
        fms=am.state;

        if(fms==null) {
            for(let el of predicts) el.disabled = false;
        } else {
            for(let el of predicts) el.disabled = true;
        };

        if(fms == 'high') {
            Yaxis++;
            levels.unshift({x: chart.width/1.5, y: (chart.height/2), t:'h'});
            if(ji.bid=='high') {
                MySweet.toast('You Won!, +'+am.profit+'Roth');
                let [{roth}] = await users_db.get('select=roth&id=eq.'+uid);
                await users_db.patch('id=eq.'+uid,{roth: roth+am.profit});
                await traders_db.patch('from=eq.'+uid,{bid: null});
                rothOut.html((roth+am.profit)+' Roth');
            } else if(ji.bid=='low') {
                MySweet.toast('You Loss!, Level went Higher.');
                await traders_db.patch('from=eq.'+uid,{bid: null});
                let [{roth}] = await users_db.get('select=roth&id=eq.'+uid);
                rothOut.html((roth)+' Roth');
            };
        } else if(fms == 'low') {
            Yaxis--;
            levels.unshift({x: chart.width/1.5, y: (chart.height/2), t:'l'});
            if(ji.bid=='low') {
                MySweet.toast('You Won!, +'+am.profit+'Roth');
                let [{roth}] = await users_db.get('select=roth&id=eq.'+uid);
                await users_db.patch('id=eq.'+uid,{roth: roth+am.profit});
                await traders_db.patch('from=eq.'+uid,{bid: null});
                rothOut.html((roth+am.profit)+' Roth');
            } else if(ji.bid=='high') {
                MySweet.toast('You Loss!, Level went Lower.');
                await traders_db.patch('from=eq.'+uid,{bid: null});
                let [{roth}] = await users_db.get('select=roth&id=eq.'+uid);
                rothOut.html((roth)+' Roth');
            };
        } else {
            levels.unshift({x: chart.width/1.5, y: (chart.height/2), t:null})
        };

        levels.forEach(lv=>{
            ctx.fillStyle = (lv.t=='h')? 'lime':  'red';
            lv.x-=2;
            if(fms=='high') {
                lv.y+=20
            } else if(fms=='low') {
                lv.y-=20
            };

            ctx.fillRect(lv.x,lv.y,5,20);
        });
        levels.forEach(lv=>{
            if(lv.x<0) levels.pop()
        });

        ctx.strokeStyle = '#555566';
        ctx.lineWidth = 2;
        ctx.beginPath();
            ctx.moveTo(0,chart.height/2);
            ctx.lineTo(chart.width,chart.height/2);
            ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = '#555566';
        ctx.font = '20px monospace'
        ctx.fillText(Yaxis+' Roth',chart.width-80,(chart.height/2)-18,70);

        setTimeout(update,100);
    } else {
        MySweet.toast('Bridge closed.');
        if(ji.bid!=null) {
            let [{roth}] = await users_db.get('select=roth&id=eq.'+uid);
            await users_db.patch("id=eq."+uid,{roth: roth+1});
        }
    }
}