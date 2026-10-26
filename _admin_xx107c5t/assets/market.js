import $ from "jquery";
import {SBServer} from "../../scripts/sb-server.module.js";

const market_sv = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "market",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
); 
const traders_db = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "traders",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
);
let allH = 0;
let allL = 0;

async function init() {
    const [mk] = await market_sv.get('limit=1');

    $('#status').html('Status: market-'+mk.bridge);
    $('#state').html('State: '+(mk.state||'paused'));
    $('#profit').html('Give out: '+(mk.profit||0)+'-roth');

    setInterval(async () => {
        allH = await traders_db.count('bid=eq.high');
        allL = await traders_db.count('bid=eq.low');
        $('#highers').html(allH);
        $('#lowers').html(allL);
    }, 50);
}
init();

globalThis.give = async (e)=> {
    let ji;
    if(e=='high') {
        await market_sv.patch('id=eq.1',{state: 'high'});
        [ji] = await market_sv.patch('id=eq.1',{profit: ((allL/2)/allH)+1});
    } else if(e=='low') {
        await market_sv.patch('id=eq.1',{state: 'low'});
        [ji] = await market_sv.patch('id=eq.1',{profit: ((allH/2)/allL)+1});
    };
    $('#state').html('State: '+(ji.state||'paused'));
    $('#profit').html('Give out: '+(ji.profit||0)+'-roth');
};

globalThis.pauseMK = async ()=> {
    let [mu] = await market_sv.patch('id=eq.1',{state: null});
    $('#state').html('State: '+(mu.state||'paused'));
};

globalThis.openMK=async()=>{
    let [er] = await market_sv.patch('id=eq.1',{bridge: 'opened'});
    $('#status').html('Status: market-'+er.bridge);
};

globalThis.closeMK=async()=>{
    let [yo] = await market_sv.patch('id=eq.1',{bridge: 'closed'});
    $('#status').html('Status: market-'+yo.bridge);
}