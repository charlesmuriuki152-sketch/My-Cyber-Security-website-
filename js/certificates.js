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

// ==========================
// FETCH ENTIRE REPO TREE IN ONE CALL
// ==========================
// Replaces the old per-folder walk (getDefaultBranch +
// getFolderContents + collectPdfsFromFolder), which made one
// API call per folder/subfolder and was slow and prone to
// failing entirely if any single nested call errored or the
// unauthenticated GitHub rate limit (60 requests/hour/IP) was
// hit partway through. This does it in two calls total,
// regardless of how many folders exist.
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

    // Link directly to the raw PDF file. Whether the visitor's
    // browser previews it inline or downloads it depends on their
    // own settings - that's normal, expected behavior, not a bug.
    // (Deliberately not routing through a third-party viewer like
    // Google Docs Viewer - that's an unofficial, undocumented
    // endpoint that could change or break without notice, and adds
    // an unnecessary third-party dependency for something this
    // simple.) Only trust URLs on GitHub's own domain, since this
    // value ultimately comes from repo content.
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

        list.appendChild(
            createCertificateItem(cert, index + 1)
        );

    });

    toggle.addEventListener("click", () => {

        const open =
            card.classList.toggle("open");

        toggle.setAttribute(
            "aria-expanded",
            open ? "true" : "false"
        );

    });

    return card;
}

// ==========================
// LOAD CERTIFICATES (single tree fetch, grouped by top folder)
// ==========================
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

document.addEventListener(
    "DOMContentLoaded",
    loadCertificates
);
