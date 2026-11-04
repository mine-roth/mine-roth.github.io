import MySweet from "../../scripts/mySweet.js";
import $ from "jquery";
import {SBServer} from "../../scripts/sb-server.module.js";

const uid = (new URLSearchParams(window.location.search)).get("uid");
const users_db = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "users",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
); 
const rothDir = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "update",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
); 
const groups = new SBServer(
    "https://sbzzbzkgbgybtlerwyic.supabase.co",
    "groups",
    "sb_publishable_mxHfTHVfW799Tf3Q9izVgQ_VAAzVxk7"
); 
const investors = new SBServer(
    "https://sbzzbzkgbgybtlerwyic.supabase.co",
    "investors",
    "sb_publishable_mxHfTHVfW799Tf3Q9izVgQ_VAAzVxk7"
);
const paystack = new window.PaystackPop();
let rothVal;

const rothBal = $('#roth');
const actBal = $('#naira');
const deposit = $('#deposit');
deposit.css('visibility','hidden');

const genEmail = `investor${uid}@mineroth.com`;

deposit.click(()=>{
    setTimeout(async () => {
        const amt = await MySweet.choose("Deposit:",{
            times2: "NGN"+rothVal*2+" for 1 Roth",
            times4: "NGN"+rothVal*4+" for 3 Roth",
            times5: "NGN"+rothVal*5+" for 4 Roth",
            times10: "NGN"+rothVal*10+" for 9 Roth",
            times20: "NGN"+rothVal*20+" for 19 Roth"
        });
        if(amt) {
           confirmDeposit(amt);
        } else {
            MySweet.toast("Aborted Deposit")
        }
    }, 200);
});

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
            window.location.reload();
        },
        onCancel: () => {
            // Nothing
        }
    });
}

init();
async function init() {
    const [{roth_val}] = await rothDir.get('limit=1');
    rothVal = roth_val;

    const [{roth}] = await users_db.get('select=roth&id=eq.'+uid);
    deposit.css('visibility','visible');
    rothBal.html(roth+" Roth");
    actBal.html('N'+(roth*rothVal));

    const [ml,wt,cg,gf] = await groups.get('limit=4');

    $('#ml-log').html(
        `success: ${ml.success}
        <br>
        failure: ${ml.failure}
        <br>
        dead-line: ${ml.end}`
    );
    $('#wt-log').html(
        `success: ${wt.success}
        <br>
        failure: ${wt.failure}
        <br>
        dead-line: ${wt.end}`
    );
    $('#cg-log').html(
        `success: ${cg.success}
        <br>
        failure: ${cg.failure}
        <br>
        dead-line: ${cg.end}`
    );
    $('#gf-log').html(
        `success: ${gf.success}
        <br>
        failure: ${gf.failure}
        <br>
        dead-line: ${gf.end}`
    );

    await updateInvs();

    $('#ml-inv').click(async()=>{
        const amt = parseInt(await MySweet.prompt('Enter Amount (NGN):','number in naira. (+ charges)'))||0;
        if(amt>=1000) {
            investNGN(amt,'Military Lions');
        } else {
            MySweet.toast('Cancelled.');
        }
    });
    $('#wt-inv').click(async()=>{
        const amt = parseInt(await MySweet.prompt('Enter Amount (NGN):','number in naira. (+ charges)'))||0;
        if(amt>=1000) {
            investNGN(amt,'Wonder Tigers');
        } else {
            MySweet.toast('Cancelled.');
        }
    })
    $('#cg-inv').click(async()=>{
        const amt = parseInt(await MySweet.prompt('Enter Amount (NGN):','number in naira. (+ charges)'))||0;
        if(amt>=1000) {
            investNGN(amt,'Conquerous Goats');
        } else {
            MySweet.toast('Cancelled.');
        }
    })
    $('#gf-inv').click(async()=>{
        const amt = parseInt(await MySweet.prompt('Enter Amount (NGN):','number in naira. (+ charges)'))||0;
        if(amt>=1000) {
            investNGN(amt,'Great Fishes');
        } else {
            MySweet.toast('Cancelled.');
        }
    })
}

async function investNGN(amount,grp) {
    if(amount && grp){
        paystack.newTransaction({
            key: 'pk_live_54a5056e953c30da8ff333ccc0ff528065070ddf', 
            email: genEmail,
            amount: (amount+(2*amount/100)+100) * 100,
            currency: 'NGN',
            channels: ["bank","card"],
            
            onSuccess: async (transc) => {
                await investors.post({from: uid, NGN: amount, in: grp});
                window.location.reload();
            },
            onCancel: () => {
                // Nothing
            }
        })
    };
}

async function updateInvs() {
    const invs = await investors.get('from=eq.'+uid);
    let str = '';
    let total = 0;
    if(invs.length){
        invs.forEach(inv=>{
            str += `${inv.in}: N${inv.NGN}<br>`;
            total += inv.NGN;
        });

        $('#my-inv').html(
            `<p class='title'>My Investments:<p>
            <p class='title'>Total: N${total}<p>
            ${str}`
        );
    }   
}