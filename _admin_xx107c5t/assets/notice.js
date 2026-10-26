import { SBServer } from "../../scripts/sb-server.module.js";
import $ from "jquery";
import Mysweet from "../../scripts/mySweet.js";

const update = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "update",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
);

const ntcType = $('#ntc-type');
const heading = $('#head');
const message = $('#mesg');
const statusOut = $('#status');

$('#notice').on("submit",async(e)=>{
    e.preventDefault();
    
    statusOut.html('Saving update...');
    await update.patch('id=eq.1',{
        head: heading.val(),
        type: ntcType.val(),
        body: message.html()
    });
    statusOut.html('Update saved.');
    Mysweet.toast('Update saved.')
});

globalThis.addImage=async()=>{
    const reader = new FileReader();
    const [handler] = await window.showOpenFilePicker({
        types: [
            {description: 'Image', accept: {'image/*': ['.png','.jpg','.jpeg','.gif']}}
        ]
    });
    const file = await handler.getFile();
    if(file.size/1024 < 299) {
        reader.onload=(e)=>{$(`<img src="${e.target.result}">`).appendTo(message)};
        reader.readAsDataURL(file);
    } else {
        Mysweet.alert('Image size is exciding.','Images should be less than 300KB');
    }
};
globalThis.addLink=async()=>{
    let link = await Mysweet.prompt('Enter Link:','www.example.com');
    if(link) {
        link = link.replace(' ','');
        if(link.search(/(?:https:\/\/|http:\/\/)/)==0){
            $(`<a href="${link}">${link.replace(/(?:https:\/\/|http:\/\/)/,'')}</a>`).appendTo(message);
        } else if(link.search(/(?:https:\/\/|http:\/\/)/)==-1){
            $(`<a href="https://${link}">${link}</a>`).appendTo(message);
        };
    }
};

setup();
async function setup() {
    const [before] = await update.get('select=head,body,type');
    statusOut.html('Upadate synced.');

    ntcType.val(before.type);
    heading.val(before.head);
    message.html(before.body);
}