// AEGIS_SCRIPT_TEST
console.log("AEGIS script loaded");

// ==========================
// CLICKJACKING PROTECTION
// ==========================
// GitHub Pages cannot serve custom HTTP headers, so the
// X-Frame-Options / CSP frame-ancestors protections aren't
// available server-side here. This is a client-side fallback:
// if this page is ever loaded inside an iframe on another
// origin, break out of it.
if (window.top !== window.self) {
    window.top.location = window.self.location;
}

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

        if (progress === 20) loadingText.textContent = bootMessages[1];
        if (progress === 45) loadingText.textContent = bootMessages[2];
        if (progress === 70) loadingText.textContent = bootMessages[3];
        if (progress === 95) loadingText.textContent = bootMessages[4];


        if (progress >= 100) {

            clearInterval(boot);

            loader.style.transition = "opacity 1s";
            loader.style.opacity = "0";

            setTimeout(() => {

                loader.style.display = "none";

                const aegisButton = document.getElementById("opportunityBtn");
                if (aegisButton) {
                    aegisButton.classList.add("aegis-active");
                }

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
"\n> " + command + "\n" + commands[command] + "\n";

}

else{

terminalOutput.textContent +=
"\n> " + command + "\nCommand not found.\n";

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

function animateCounter(id, target, zeroLabel) {

    const element = document.getElementById(id);

    if (!element) return;

    let count = 0;

if (target === 0) {
    element.textContent = zeroLabel || "0";
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

// Manually maintained counts for labs that don't yet have a
// dedicated repo to auto-count from. Update these as new
// repos/labs are added.
const manualCounts = {
    linux: 0,        // No dedicated Linux labs repo yet
    networking: 1,   // Packet-Tracer (Cisco wireless config lab)
    security: 0,     // No dedicated security labs repo yet
    projects: 3      // Packet-Tracer, Cybersecurity-Journey, My-Cyber-Security-website-
};

// Fallback values used if the GitHub API is unreachable or
// rate-limited, so the dashboard never silently shows 0 for
// counts that do have real content.
const fallbackCounts = {
    python: 5,
    certificates: 1
};


// ==========================
// FETCH GITHUB TREE
// ==========================

async function fetchGitHubTree(repo) {

    const repoUrl =
        `https://api.github.com/repos/${githubUser}/${repo}`;

    const repoResponse = await fetch(repoUrl, {
        cache: "no-store"
    });

    if (!repoResponse.ok) {
        throw new Error(
            `GitHub repository error: ${repoResponse.status}`
        );
    }

    const repoData = await repoResponse.json();

    const branch =
        repoData.default_branch;

    const treeUrl =
        `https://api.github.com/repos/${githubUser}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`;

    const treeResponse =
        await fetch(treeUrl, {
            cache: "no-store"
        });

    if (!treeResponse.ok) {
        throw new Error(
            `GitHub tree error: ${treeResponse.status}`
        );
    }

    const treeData =
        await treeResponse.json();

    return treeData;
}


// ==========================
// COUNT PYTHON LABS
// ==========================

async function countPythonLabs() {

    const data =
        await fetchGitHubTree(
            githubRepos.python
        );

    const files =
        data.tree || [];

    return files.filter(item =>
        item.type === "blob" &&
        item.path
            .toLowerCase()
            .endsWith(".py")
    ).length;
}


// ==========================
// COUNT CERTIFICATIONS
// ==========================

async function countCertificates() {

    const data =
        await fetchGitHubTree(
            githubRepos.certificates
        );

    const files =
        data.tree || [];

    return files.filter(item =>
        item.type === "blob" &&
        item.path
            .toLowerCase()
            .endsWith(".pdf")
    ).length;
}


// ==========================
// LOAD DASHBOARD COUNTERS
// ==========================

async function loadDashboardCounters() {

    let pythonCount = fallbackCounts.python;
    let certCount = fallbackCounts.certificates;

    try {

        const [
            livePythonCount,
            liveCertCount
        ] = await Promise.all([

            countPythonLabs(),

            countCertificates()

        ]);

        console.log(
            "GitHub Dashboard (live):",
            {
                pythonLabs: livePythonCount,
                certificates: liveCertCount
            }
        );

        pythonCount = livePythonCount;
        certCount = liveCertCount;

    } catch (error) {

        console.warn(
            "GitHub API unavailable, using fallback counts:",
            error
        );

    }

    animateCounter(
        "pythonCount",
        pythonCount
    );

    animateCounter(
        "certCount",
        certCount
    );

    animateCounter(
        "linuxCount",
        manualCounts.linux,
        "Soon"
    );

    animateCounter(
        "networkCount",
        manualCounts.networking
    );

    animateCounter(
        "projectCount",
        manualCounts.projects
    );

    animateCounter(
        "securityCount",
        manualCounts.security,
        "Soon"
    );

}

async function loadGithubProfileStats() {

    const repoEl = document.getElementById("githubRepoCount");
    const followerEl = document.getElementById("githubFollowerCount");

    if (!repoEl || !followerEl) return;

    try {

        const response = await fetch(
            `https://api.github.com/users/${githubUser}`
        );

        if (!response.ok) throw new Error("GitHub API error");

        const data = await response.json();

        repoEl.textContent = data.public_repos ?? "—";
        followerEl.textContent = data.followers ?? "—";

    } catch (error) {

        console.warn("GitHub profile stats unavailable:", error);
        repoEl.textContent = "—";
        followerEl.textContent = "—";

    }

}


window.addEventListener(
    "load",
    loadDashboardCounters
);

window.addEventListener(
    "load",
    loadGithubProfileStats
);

// ==========================
// PASSWORD STRENGTH CHECKER
// ==========================

const pwInput = document.getElementById("pwInput");
const pwToggle = document.getElementById("pwToggle");
const pwMeterFill = document.getElementById("pwMeterFill");
const pwLabel = document.getElementById("pwLabel");
const pwEntropy = document.getElementById("pwEntropy");

const commonPatterns = [
    "password", "123456", "12345678", "qwerty", "letmein",
    "admin", "welcome", "abc123", "iloveyou", "monkey",
    "football", "charlie", "muriuki", "kenya", "aegis"
];

function hasSequential(str) {
    const lower = str.toLowerCase();
    const sequences = ["abcdefgh", "12345678", "qwertyui"];
    return sequences.some(seq => {
        for (let i = 0; i <= seq.length - 4; i++) {
            if (lower.includes(seq.slice(i, i + 4))) return true;
        }
        return false;
    });
}

function hasRepeatedChars(str) {
    return /(.)\1\1/.test(str);
}

function checkPassword(value) {

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNum = /[0-9]/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);
    const isLongEnough = value.length >= 12;

    const lowerValue = value.toLowerCase();
    const containsCommon = commonPatterns.some(
        p => lowerValue.includes(p)
    );
    const isNotCommon =
        value.length > 0 &&
        !containsCommon &&
        !hasSequential(value) &&
        !hasRepeatedChars(value);

    setCheck("pwLen", isLongEnough);
    setCheck("pwUpper", hasUpper);
    setCheck("pwLower", hasLower);
    setCheck("pwNum", hasNum);
    setCheck("pwSymbol", hasSymbol);
    setCheck("pwCommon", isNotCommon);

    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasNum) charsetSize += 10;
    if (hasSymbol) charsetSize += 32;

    const entropy =
        value.length > 0 && charsetSize > 0
            ? Math.round(value.length * Math.log2(charsetSize))
            : 0;

    let score = 0;
    if (isLongEnough) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNum) score++;
    if (hasSymbol) score++;
    if (isNotCommon) score++;

    let label, fillPercent, fillColor;

    if (value.length === 0) {
        label = "Enter a password above";
        fillPercent = 0;
        fillColor = "#10233f";
    } else if (!isNotCommon || score <= 2) {
        label = "Weak";
        fillPercent = 25;
        fillColor = "#ff4d4d";
    } else if (score <= 4) {
        label = "Fair";
        fillPercent = 50;
        fillColor = "#ffb020";
    } else if (score === 5) {
        label = "Strong";
        fillPercent = 75;
        fillColor = "#2f80ff";
    } else {
        label = "Very Strong";
        fillPercent = 100;
        fillColor = "#00e5b0";
    }

    if (pwLabel) pwLabel.textContent = label;

    if (pwMeterFill) {
        pwMeterFill.style.width = fillPercent + "%";
        pwMeterFill.style.background = fillColor;
    }

    if (pwEntropy) {
        pwEntropy.textContent =
            value.length > 0
                ? `Estimated entropy: ~${entropy} bits`
                : "";
    }

}

function setCheck(id, passed) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("pw-pass", passed);
    el.classList.toggle("pw-fail", !passed);
}

if (pwInput) {

    pwInput.addEventListener("input", (e) => {
        checkPassword(e.target.value);
    });

    checkPassword("");

}

if (pwToggle && pwInput) {

    const eyeOpen = document.getElementById("pwEyeOpen");
    const eyeClosed = document.getElementById("pwEyeClosed");

    pwToggle.addEventListener("click", () => {
        const isHidden = pwInput.type === "password";
        pwInput.type = isHidden ? "text" : "password";
        pwToggle.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );

        if (eyeOpen && eyeClosed) {
            eyeOpen.style.display = isHidden ? "none" : "block";
            eyeClosed.style.display = isHidden ? "block" : "none";
        }
    });

}

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
                status.textContent = "Status: Monitoring";
            } else {
                status.textContent = "Threats Detected: " + number;
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
    const contactOpportunity = document.getElementById("contactOpportunity");

    if (opportunityBtn && opportunityModal && closeOpportunity) {

        if (contactOpportunity) {
            contactOpportunity.addEventListener("click", () => {

                // Close the opportunities modal
                opportunityModal.classList.remove("active");
    

                // Scroll to Contact after the modal has been removed
                requestAnimationFrame(() => {

                    const contactSection = document.getElementById("contact");

                    if (contactSection) {
                        contactSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }

                });

            });
        }

        opportunityBtn.addEventListener("click", () => {
            opportunityModal.classList.add("active");

        });

        closeOpportunity.addEventListener("click", () => {
            opportunityModal.classList.remove("active");

        });

        opportunityModal.addEventListener("click", (event) => {
            if (event.target === opportunityModal) {
                opportunityModal.classList.remove("active");
    
            }
        });

    }

});


// ==========================
// ==========================
// AEGIS SCROLL REVEAL ENGINE
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) return;

    // Always reveal the first visible section immediately
    revealElements.forEach((element, index) => {
        if (index === 0) {
            element.classList.add("active");
        }
    });

    // Use scroll-based reveal when supported
    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.05
            }
        );

        revealElements.forEach((element) => {
            if (!element.classList.contains("active")) {
                revealObserver.observe(element);
            }
        });

    } else {

        // Fallback for browsers without IntersectionObserver
        revealElements.forEach((element) => {
            element.classList.add("active");
        });

    }

});