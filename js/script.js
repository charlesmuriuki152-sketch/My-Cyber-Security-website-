// =========================
// CYBERPORTFOLIO V2
// =========================

// ---------- Typing Animation ----------

const typingElement = document.getElementById("typing");
const text = "CYBER SECURITY ENGINEER";

let index = 0;

function typeWriter(){

    if(index < text.length){

        typingElement.textContent += text.charAt(index);

        index++;

        setTimeout(typeWriter,80);

    }

}

// ---------- Boot Loader ----------

const loader=document.getElementById("loader");
const progress=document.getElementById("progress-bar");
const loading=document.getElementById("loading-text");

const messages=[
"Initializing Secure Environment...",
"Loading Linux Kernel...",
"Starting Security Modules...",
"Launching Network Monitor...",
"Access Granted"
];

let width=0;
let step=0;

const boot=setInterval(()=>{

    width+=1;

    progress.style.width=width+"%";

    if(width===20) loading.textContent=messages[1];

    if(width===45) loading.textContent=messages[2];

    if(width===70) loading.textContent=messages[3];

    if(width===95) loading.textContent=messages[4];

    if(width>=100){

        clearInterval(boot);

        loader.style.transition="opacity 1s";

        loader.style.opacity="0";

        setTimeout(()=>{

            loader.style.display="none";

            typeWriter();

        },1000);

    }

},40);
