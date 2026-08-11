// AEGIS_SCRIPT_TEST
console.log("AEGIS script loaded");

// ======================================
// PROJECT AEGIS v2
// Author: Charles Muriuki
// ======================================

// ==========================
// TYPING ANIMATION
// ==========================

const typingElement = document.getElementById("typing");
const typingText = "CYBER SECURITY ENGINEER";
let typingIndex = 0;

function typeWriter() {
    if (!typingElement) return;

    if (typingIndex < typingText.length) {
        typingElement.textContent += typingText.charAt(typingIndex);
        typingIndex++;
        setTimeout(typeWriter, 80);
    }
}

// ==========================
// BOOT LOADER
// ==========================

const loader = document.getElementById("loader");
const progressBar = document.getElementById("progress-bar");
const loadingText = document.getElementById("loading-text");

const bootMessages = [
    "Initializing Secure Environment...",
    "Loading Linux Kernel...",
    "Starting Security Modules...",
    "Launching Network Monitor...",
    "Access Granted"
];

let progress = 0;

if (loader && progressBar && loadingText) {

    const boot = setInterval(() => {

        progress++;

        progressBar.style.width = progress + "%";

        if (progress === 20)
            loadingText.textContent = bootMessages[1];

        if (progress === 45)
            loadingText.textContent = bootMessages[2];

        if (progress === 70)
            loadingText.textContent = bootMessages[3];

        if (progress === 95)
            loadingText.textContent = bootMessages[4];

        if (progress >= 100) {

            clearInterval(boot);

            loader.style.transition = "opacity 1s";
            loader.style.opacity = "0";

            setTimeout(() => {

                loader.style.display = "none";
                typeWriter();

            }, 1000);

        }

    }, 40);

}
// ==========================
// TERMINAL
// ==========================

const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

const commands = {

help:`Available Commands

help
about
skills
projects
contact
whoami
clear`,

about:`Charles Muriuki

Aspiring Cybersecurity Engineer

Python
Linux
Networking
Ethical Hacking`,

skills:`Python
Linux
Git
GitHub
Networking
Kali Linux
Wireshark`,

projects:`Project AEGIS
Python Labs
Linux Labs
Networking Labs

More Coming Soon...`,

contact:`GitHub

github.com/charlesmuriuki152`,

whoami:`charles-muriuki
Cybersecurity Engineer`

};

if(terminalInput && terminalOutput){

terminalInput.addEventListener("keydown",function(e){

if(e.key==="Enter"){

const command=terminalInput.value.trim().toLowerCase();

if(command==="clear"){

terminalOutput.textContent="";

}

else if(commands[command]){

terminalOutput.textContent +=
"\n\n> " + command + "\n" + commands[command];

}

else{

terminalOutput.textContent +=
"\n\n> " + command + "\nCommand not found.";

}

terminalInput.value="";

terminalOutput.scrollTop=terminalOutput.scrollHeight;

}

});

}

// ==========================
// PARTICLE BACKGROUND
// ==========================

const canvas=document.getElementById("cyber-bg");

if(canvas){

const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

const particles=[];

for(let i=0;i<80;i++){

particles.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*3+1,
dx:(Math.random()-0.5),
dy:(Math.random()-0.5)

});

}

function animateParticles(){

ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{

ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle="#3b82ff";
ctx.fill();

p.x+=p.dx;
p.y+=p.dy;

if(p.x<0||p.x>canvas.width)p.dx*=-1;
if(p.y<0||p.y>canvas.height)p.dy*=-1;

});

requestAnimationFrame(animateParticles);

}

animateParticles();

window.addEventListener("resize",()=>{

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

});

}
// ==========================
// DASHBOARD COUNTERS
// ==========================

function animateCounter(id, target) {

    const element = document.getElementById(id);

    if (!element) return;

    let count = 0;

if (target === 0) {
    element.textContent = "0";
    return;
}

    const timer = setInterval(() => {

        count++;

        element.textContent = count;

        if (count >= target) {
            clearInterval(timer);
        }

    }, 40);
}

// ==========================
// GITHUB DASHBOARD DATA
// ==========================

const githubUser = "charlesmuriuki152-sketch";

const githubRepos = {
    python: "PYTHON-",
    certificates: "Cyber-Certificates"
};


// ==========================
// FETCH GITHUB REPOSITORY
// ==========================

async function fetchGitHubTree(repo) {

    const repoUrl =
        `https://api.github.com/repos/${githubUser}/${repo}`;

    const repoResponse = await fetch(repoUrl);

    if (!repoResponse.ok) {
        throw new Error(`GitHub repository error: ${repoResponse.status}`);
    }

    const repoData = await repoResponse.json();

    const branch = repoData.default_branch;

    const treeUrl =
        `https://api.github.com/repos/${githubUser}/${repo}/git/trees/${branch}?recursive=1`;

    const treeResponse = await fetch(treeUrl);

    if (!treeResponse.ok) {
        throw new Error(`GitHub tree error: ${treeResponse.status}`);
    }

    return await treeResponse.json();
}


// ==========================
// COUNT PYTHON LABS
// ==========================

async function countPythonLabs() {

    const data = await fetchGitHubTree(githubRepos.python);

    if (!data.tree) return 0;

    return data.tree.filter(item =>
        item.type === "blob" &&
        item.path.toLowerCase().endsWith(".py")
    ).length;
}


// ==========================
// COUNT CERTIFICATIONS
// ==========================

async function countCertificates() {

    const data = await fetchGitHubTree(githubRepos.certificates);

    if (!data.tree) return 0;

    return data.tree.filter(item =>
        item.type === "blob" &&
        item.path.toLowerCase().endsWith(".pdf")
    ).length;
}


// ==========================
// LOAD DASHBOARD COUNTERS
// ==========================

async function loadDashboardCounters() {

    try {

        const [pythonCount, certCount] = await Promise.all([
            countPythonLabs(),
            countCertificates()
        ]);

        animateCounter("pythonCount", pythonCount);

        animateCounter("certCount", certCount);


        // Repositories not created yet

        animateCounter("linuxCount", 0);

        animateCounter("networkCount", 0);

        animateCounter("projectCount", 0);

        animateCounter("securityCount", 0);

    }

    catch (error) {

        console.error(
            "Dashboard GitHub data error:",
            error
        );

    }

}


window.addEventListener(
    "load",
    loadDashboardCounters
);

// ==========================
// SECURE ACCESS
// ==========================

const scanButton=document.getElementById("scanButton");
const scanResult=document.getElementById("scanResult");

if(scanButton && scanResult){

scanButton.addEventListener("click",()=>{

scanResult.textContent="Scanning identity...";

setTimeout(()=>{

scanResult.textContent="✓ Identity Verified | Access Granted";

},1500);

});

}

// ==========================
// SECTION REVEAL
// ==========================

const revealSections=document.querySelectorAll(".reveal");

function revealOnScroll(){

revealSections.forEach(section=>{

const top=section.getBoundingClientRect().top;

const trigger=window.innerHeight-100;

if(top<trigger){

section.classList.add("active");

}

});

}

window.addEventListener("scroll",revealOnScroll);
window.addEventListener("load",revealOnScroll);
// ==========================
// SMOOTH NAVIGATION
// ==========================

document.querySelectorAll('a[href^="#"]').forEach(link=>{

link.addEventListener("click",function(e){

const target=document.querySelector(this.getAttribute("href"));

if(target){

e.preventDefault();

target.scrollIntoView({

behavior:"smooth",
block:"start"

});

}

});

});

// ==========================
// INITIALIZATION
// ==========================

window.addEventListener("load",()=>{

revealOnScroll();

});

// ==========================
// FINISH
// ==========================
// ==========================
// LIVE ATTACK COUNTER
// ==========================

const blockedCounter = document.getElementById("blockedCount");

if (blockedCounter) {

    let attacks = 0;

    setInterval(() => {

        attacks += Math.floor(Math.random() * 4) + 1;

        blockedCounter.textContent = attacks;

    }, 1200);

}
console.log("================================");
console.log("PROJECT AEGIS v2 LOADED");
console.log("Charles Muriuki");
console.log("================================");
// ==========================
// THREAT ACTIVITY ANIMATION
// ==========================

const threatBoxes = document.querySelectorAll(".country");

function updateThreats() {

    threatBoxes.forEach(box => {

        const number = Math.floor(Math.random() * 50) + 1;

        const status = box.querySelector("p");

        if (status) {
            if (box.innerText.includes("Monitoring")) {
                status.innerHTML = "Status: Monitoring";
            } else {
                status.innerHTML = "Threats Detected: " + number;
            }
        }

    });

}

setInterval(updateThreats, 5000);


// ==========================
// CYBERSECURITY OPPORTUNITIES
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const opportunityBtn = document.getElementById("opportunityBtn");
    const opportunityModal = document.getElementById("opportunityModal");
    const closeOpportunity = document.getElementById("closeOpportunity");

    if (opportunityBtn && opportunityModal && closeOpportunity) {

        opportunityBtn.addEventListener("click", () => {
            opportunityModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });

        closeOpportunity.addEventListener("click", () => {
            opportunityModal.classList.remove("active");
            document.body.style.overflow = "";
        });

        opportunityModal.addEventListener("click", (event) => {
            if (event.target === opportunityModal) {
                opportunityModal.classList.remove("active");
                document.body.style.overflow = "";
            }
        });

    }

});

