import {SBServer} from "../../scripts/sb-server.module.js";
import MySweet from "../../scripts/mySweet.js";
import $ from "jquery";

const upd_db = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "update",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
);

startUp();
async function startUp() {
    const [actual] = await upd_db.get("limit=1");
    $("#actual-type").html(actual.type);
    $("#actual-head").html(actual.head);
    $("#actual-body").html(actual.body);
}
