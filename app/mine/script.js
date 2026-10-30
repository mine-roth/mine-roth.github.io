import * as THREE from "three";
import {SBServer} from "../../scripts/sb-server.module.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import MySweet from "../../scripts/mySweet.js";
// Strict

let width = window.innerWidth;
let height = window.innerHeight;

let pend_roth = localStorage.getItem("pRoth")||0;

const uid = (new URLSearchParams(window.location.search)).get("uid");
const users_db = new SBServer(
    "https://hqqykvvumlgoudkikmlx.supabase.co",
    "users",
    "sb_publishable_WUK6FDzfwvMBMd50a4HHcw_VvV7uMDs"
); 

startUp();
async function startUp(){
{ 
    const [{roth}] = await users_db.get(`id=eq.${uid}&select=roth`);
    document.getElementById("roth-disp").innerHTML=`Roth: ${roth} P ${pend_roth}`;
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const camera = new THREE.PerspectiveCamera(45,width/height,0.1,100);
camera.position.set(0,0,4);
scene.add(camera);

const light = new THREE.AmbientLight(0xffffff,1);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xff00ff,1);
scene.add(dirLight);

const renderer = new THREE.WebGLRenderer({
    antialias: false,
});
renderer.setSize(width,height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.shadowMap.enabled = true;
document.getElementById("ore-sfx").append(renderer.domElement);

window.addEventListener("resize",()=>{
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width/height;
    renderer.setSize(width,height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
});

const oreLoader = new GLTFLoader();

const ore = (await oreLoader.loadAsync("mr-Ore.gltf")).scene;
ore.scale.set(0.3,0.3,0.3);
scene.add(ore);

ore.rotation.x += 0.9;
let delta_click;
let on_out = false;
let ready = false;

window.addEventListener("focus",async()=> {
    if(on_out){
        if(delta_click < new Date().getMinutes()) {
            pend_roth++;
            localStorage.setItem("pRoth",pend_roth);
            on_out = false;
            MySweet.toast(`+1 P`);

            if(pend_roth>19){
                const [prev] = await users_db.get(`id=eq.${uid}&select=roth`);
                await users_db.patch(`id=eq.${uid}`,{
                    roth: prev.roth+1
                });

                pend_roth = 0;
                localStorage.setItem("pRoth",pend_roth);
            };
            // Display value
            const [{roth}] = await users_db.get(`id=eq.${uid}&select=roth`);
            document.getElementById("roth-disp").innerHTML=`Roth: ${roth} P ${pend_roth}`;
        } else {
            MySweet.toast("You came back too early. At least wait after 1 minute.")
            on_out = false;
        };
    }
});

// Reload manager
setTimeout(async() => {
    if(document.getElementById("init").innerHTML != "Interact with Ads.") {
        if(await MySweet.confirm("Ads are taking too long to load.","Press OK to reload this page.")) location.reload();
    }
}, 20000);

// Rendering
update();

async function update() {
    if(document.querySelectorAll("iframe").length && !ready) {
      ready = true;
      document.getElementById("init").innerHTML = "Interact with Ads."
      window.addEventListener("blur",()=>{
          delta_click = new Date().getMinutes();
          on_out = true;
      })
    };
    
    renderer.render(scene,camera);

    ore.rotation.y += 0.04;

    requestAnimationFrame(update);
}

}
