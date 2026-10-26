import {SBServer} from "../../scripts/sb-server.module.js";
import $ from "jquery";
import Mysweet from "../../scripts/mySweet.js";

const users = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "users",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
);
const statusOut = $('#status');

let fkdb; // DB
let suid; // Selected UID
let lastUid; 
let firstUid;
globalThis.selectUID=(uid, row)=>{
    suid=uid;
    $('#info').html('Users Database [ selected-uid: '+uid+' ]');
    $('tr').removeClass('selected2');
    $('tr td').removeClass('selected');
    $('#r'+row).addClass('selected2');
    $('#r'+row+' td').first().addClass('selected');
};

kickOff();
async function kickOff() {
    fkdb = await users.get(`limit=7`);
    for(let u=0;u<7;u++) {
        if(fkdb[u]) {
            $('#r'+u).html(
                `<td onclick="selectUID(${fkdb[u].id},${u})">${fkdb[u].id}</td>
                <td>${fkdb[u].name}</td>
                <td>${fkdb[u].roth}</td>
                <td>${fkdb[u].bank}</td>
                <td>${fkdb[u].bName}</td>
                <td>${fkdb[u].lastUsed}</td>
                <td>${fkdb[u].payed}</td>
                <td>${fkdb[u].bError}</td>
                `
            );
        } else {
            $('#r'+u).html('<td>---</td>')
        }
    };
    lastUid = fkdb[fkdb.length-1].id;
    firstUid = fkdb[0].id;

    const Total = await users.count('id=gt.0');
    Mysweet.toast('Total users = '+Total);

    $('#startf').on("submit",async(e)=>{
        e.preventDefault();

        const uid = $('#startf input').val();
        await startAfter(uid);
        $('#payout input').val('');
    });
    $('#payout').on("submit",async(e)=>{
        e.preventDefault();

        const NGN = $('#payout input').val();
        if(suid) {
            await users.patch('id=eq.'+suid,{payed: NGN});
            await updateRows();
            Mysweet.toast('Payed User: '+suid);            
        } else {
            Mysweet.toast("No UID selected.")
        };
        $('#payout input').val('');
    });
};

globalThis.deleteUser=async()=>{
    if(suid) {
        if(await Mysweet.confirm('Do you want to delete','UID: '+suid)) {
            statusOut.html('Deleting...');
            await users.delete('id=eq.'+suid);
            Mysweet.toast('Deleted User: '+suid);
            await updateRows();
        }
    } else {
        Mysweet.toast("No UID selected.")
    }
};

async function updateRows() {
    statusOut.html('Updating changes...');
    fkdb = await users.get(`id=gte.${firstUid}&limit=7`);
    for(let u=0;u<7;u++) {
        if(fkdb[u]) {
            $('#r'+u).html(
                `<td onclick="selectUID(${fkdb[u].id},${u})">${fkdb[u].id}</td>
                <td>${fkdb[u].name}</td>
                <td>${fkdb[u].roth}</td>
                <td>${fkdb[u].bank}</td>
                <td>${fkdb[u].bName}</td>
                <td>${fkdb[u].lastUsed}</td>
                <td>${fkdb[u].payed}</td>
                <td>${fkdb[u].bError}</td>
                `
            );
        } else {
            $('#r'+u).html('<td>---</td>')
        }
    };
    lastUid = fkdb[fkdb.length-1].id;
    firstUid = fkdb[0].id;
    statusOut.html('Online.');
}

async function startAfter(uid) {
    statusOut.html('Getting Data...');
    fkdb = await users.get(`id=gt.${uid}&limit=7`);
    for(let u=0;u<7;u++) {
        if(fkdb[u]) {
            $('#r'+u).html(
                `<td onclick="selectUID(${fkdb[u].id},${u})">${fkdb[u].id}</td>
                <td>${fkdb[u].name}</td>
                <td>${fkdb[u].roth}</td>
                <td>${fkdb[u].bank}</td>
                <td>${fkdb[u].bName}</td>
                <td>${fkdb[u].lastUsed}</td>
                <td>${fkdb[u].payed}</td>
                <td>${fkdb[u].bError}</td>
                `
            );
        } else {
            $('#r'+u).html('<td>---</td>')
        }
    };
    lastUid = fkdb[fkdb.length-1].id;
    firstUid = fkdb[0].id;
    statusOut.html('Online');
};

globalThis._next=async()=>{
    await startAfter(lastUid);
}