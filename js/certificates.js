const GITHUB_USERNAME = "charlesmuriuki152-sketch";
const REPO_NAME = "Cyber-Certificates";

function encodePath(path) {
    return path.split("/").map(encodeURIComponent).join("/");
}

function cleanTitle(filename) {
    return filename
        .replace(/\.pdf$/i, "")
        .replace(/[-_]certificate.*$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

async function fetchJson(url) {
    const response = await fetch(url, {
        headers: {
            Accept: "application/vnd.github+json"
        },
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
}

function createCertificateItem(cert, number) {

    const item = document.createElement("div");
    item.className = "certificate-item";

    const numberDiv = document.createElement("div");
    numberDiv.className = "certificate-number";
    numberDiv.textContent = number + ".";

    const details = document.createElement("div");
    details.className = "certificate-details";

    const title = document.createElement("h4");
    title.className = "certificate-title";
    title.textContent = cert.title;

    const link = document.createElement("a");
    link.className = "view-github-btn";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View Certificate";

    if (
        typeof cert.download_url === "string" &&
        /^https:\/\/raw\.githubusercontent\.com\//.test(cert.download_url)
    ) {
        link.href = cert.download_url;
    } else if (
        typeof cert.html_url === "string" &&
        /^https:\/\/github\.com\//.test(cert.html_url)
    ) {
        link.href = cert.html_url;
    } else {
        link.href = "#";
        link.setAttribute("aria-disabled", "true");
    }

    details.appendChild(title);
    details.appendChild(link);
    item.appendChild(numberDiv);
    item.appendChild(details);

    return item;
}

function createCategoryCard(categoryName, certificates) {

    const card = document.createElement("div");
    card.className = "certificate-category";

    const toggle = document.createElement("button");
    toggle.className = "certificate-category-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = categoryName;

    const countSpan = document.createElement("span");
    countSpan.textContent = certificates.length + " Certificates ";

    const chevron = document.createElement("span");
    chevron.className = "chevron";
    chevron.textContent = "▼";
    countSpan.appendChild(chevron);

    toggle.appendChild(nameSpan);
    toggle.appendChild(countSpan);

    const list = document.createElement("div");
    list.className = "certificate-list";

    card.appendChild(toggle);
    card.appendChild(list);

    certificates.forEach((cert, index) => {
        list.appendChild(createCertificateItem(cert, index + 1));
    });

    toggle.addEventListener("click", () => {
        const open = card.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    return card;
}

async function fetchRepoTree() {
    const repoRes = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}`,
        { cache: "no-store" }
    );
    if (!repoRes.ok) throw new Error(`Repo error: ${repoRes.status}`);
    const branch = (await repoRes.json()).default_branch || "main";

    const treeRes = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
        { cache: "no-store" }
    );
    if (!treeRes.ok) throw new Error(`Tree error: ${treeRes.status}`);

    return { branch, tree: (await treeRes.json()).tree || [] };
}

function rawUrl(branch, path) {
    return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${branch}/${encodePath(path)}`;
}

async function loadCertificates() {

    const container = document.getElementById("certificate-categories");

    if (!container) {
        console.error("Certificate container #certificate-categories not found.");
        return;
    }

    container.innerHTML = "";
    const loadingMsg = document.createElement("p");
    loadingMsg.className = "certificate-loading";
    loadingMsg.textContent = "Loading certificates...";
    container.appendChild(loadingMsg);

    try {
        const { branch, tree } = await fetchRepoTree();
        const pdfFiles = tree.filter(item =>
            item.type === "blob" && item.path.toLowerCase().endsWith(".pdf")
        );
        const categories = {};

        for (const file of pdfFiles) {
            const parts = file.path.split("/");
            const categoryName = parts.length > 1 ? parts[0] : "General";
            if (!categories[categoryName]) categories[categoryName] = [];

            categories[categoryName].push({
                title: cleanTitle(parts[parts.length - 1]),
                path: file.path,
                html_url: `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/blob/${branch}/${encodePath(file.path)}`,
                download_url: rawUrl(branch, file.path)
            });
        }

        container.innerHTML = "";
        const names = Object.keys(categories).sort((a, b) => {
            if (a === "General") return -1;
            if (b === "General") return 1;
            return a.localeCompare(b);
        });

        if (names.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.textContent = "No certificates found.";
            container.appendChild(emptyMsg);
            return;
        }

        names.forEach(name => {
            container.appendChild(createCategoryCard(name, categories[name]));
        });
    } catch (error) {
        console.error("Certificate Engine Error:", error);
        const errorMsg = document.createElement("p");
        errorMsg.style.color = "red";
        errorMsg.textContent = "Unable to load certificates. Please try again later.";
        container.innerHTML = "";
        container.appendChild(errorMsg);
    }
}

// Keep every account-backed counter synchronized with the public GitHub account.
// Repository classifications are based on repository names/descriptions; project
// count is the complete public repository count, and Python/certificate counts
// are based on actual files in the corresponding repositories.
async function fetchAllPublicRepositories() {
    const repositories = [];

    for (let page = 1; page <= 10; page++) {
        const pageData = await fetchJson(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&per_page=100&page=${page}`
        );
        repositories.push(...pageData);
        if (pageData.length < 100) break;
    }

    return repositories.filter(repo =>
        !repo.private && !repo.archived && !repo.fork
    );
}

async function countFilesInRepository(repository, extension) {
    const branch = repository.default_branch || "main";
    const tree = await fetchJson(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${encodeURIComponent(repository.name)}/git/trees/${encodeURIComponent(branch)}?recursive=1`
    );

    return (tree.tree || []).filter(item =>
        item.type === "blob" &&
        typeof item.path === "string" &&
        item.path.toLowerCase().endsWith(extension)
    ).length;
}

function updateCounter(id, value, zeroLabel) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = value === 0 && zeroLabel ? zeroLabel : String(value);
}

async function syncGithubAccountCounts() {
    try {
        const [profile, repositories] = await Promise.all([
            fetchJson(`https://api.github.com/users/${GITHUB_USERNAME}`),
            fetchAllPublicRepositories()
        ]);

        const repoCount = repositories.length;
        updateCounter("githubRepoCount", repoCount);
        updateCounter("githubFollowerCount", profile.followers ?? 0);

        const repositoryText = repositories.map(repo =>
            `${repo.name} ${repo.description || ""}`.toLowerCase()
        );
        const matches = terms => repositoryText.filter(text =>
            terms.some(term => text.includes(term))
        ).length;

        const pythonRepository = repositories.find(repo =>
            repo.name.toLowerCase() === "python-"
        );
        const certificateRepository = repositories.find(repo =>
            repo.name.toLowerCase() === "cyber-certificates"
        );

        const [pythonCount, certificateCount] = await Promise.all([
            pythonRepository ? countFilesInRepository(pythonRepository, ".py") : 0,
            certificateRepository ? countFilesInRepository(certificateRepository, ".pdf") : 0
        ]);

        updateCounter("pythonCount", pythonCount, "Soon");
        updateCounter("certCount", certificateCount, "Soon");
        updateCounter("projectCount", repoCount, "Soon");
        updateCounter("linuxCount", matches(["linux", "kali", "ubuntu", "termux"]), "Soon");
        updateCounter("networkCount", matches(["network", "packet tracer", "cisco", "wireshark"]), "Soon");
        updateCounter("securityCount", matches(["security", "cyber", "soc", "ethical hacking", "penetration"]), "Soon");
    } catch (error) {
        console.warn("GitHub account counters unavailable:", error);
        // Do not replace live values with invented fallback values.
        // The existing placeholders remain visible when GitHub is unavailable.
    }
}

document.addEventListener("DOMContentLoaded", loadCertificates);
window.addEventListener("load", syncGithubAccountCounts);
