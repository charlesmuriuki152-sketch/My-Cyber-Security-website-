const GITHUB_USERNAME = "charlesmuriuki152-sketch";
const REPO_NAME = "Cyber-Certificates";

function encodePath(path) {
    return path.split("/").map(encodeURIComponent).join("/");
}

function cleanTitle(filename) {
    return filename
        .replace(/\.pdf$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

async function fetchJson(url) {
    const response = await fetch(url, {
        headers: {
            Accept: "application/vnd.github+json"
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
}

async function getDefaultBranch() {
    const repo = await fetchJson(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}`
    );
    return repo.default_branch || "main";
}

async function getFolderContents(path, branch) {
    const url = path
        ? `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`
        : `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents?ref=${encodeURIComponent(branch)}`;

    return fetchJson(url);
}

async function collectPdfsFromFolder(folderPath, branch) {
    const items = await getFolderContents(folderPath, branch);
    let pdfs = [];

    for (const item of items) {
        if (item.type === "file" && item.name.toLowerCase().endsWith(".pdf")) {
            pdfs.push({
                title: cleanTitle(item.name),
                path: item.path,
                html_url: item.html_url
            });
        }

        if (item.type === "dir") {
            const nested = await collectPdfsFromFolder(item.path, branch);
            pdfs = pdfs.concat(nested);
        }
    }

    return pdfs;
}

function createCertificateItem(cert, number) {
    const item = document.createElement("div");
    item.className = "certificate-item";

    item.innerHTML = `
        <div class="certificate-number">${number}.</div>
        <div class="certificate-details">
            <h4 class="certificate-title">${cert.title}</h4>
            <a class="view-github-btn"
               href="${cert.html_url}"
               target="_blank"
               rel="noopener noreferrer">
               View on GitHub
            </a>
        </div>
    `;

    return item;
}

function createCategoryCard(categoryName, certificates) {
    const card = document.createElement("div");
    card.className = "certificate-category";

    const listId = `list-${categoryName.toLowerCase().replace(/\s+/g, "-")}`;

    card.innerHTML = `
        <button class="certificate-category-toggle" type="button" aria-expanded="false">
            <span>${categoryName}</span>
            <span>${certificates.length} Certificates <span class="chevron">▼</span></span>
        </button>
        <div class="certificate-list" id="${listId}"></div>
    `;

    const toggle = card.querySelector(".certificate-category-toggle");
    const list = card.querySelector(".certificate-list");

    certificates.forEach((cert, index) => {
        list.appendChild(createCertificateItem(cert, index + 1));
    });

    toggle.addEventListener("click", () => {
        const open = card.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    return card;
}

async function loadCertificates() {
    const container = document.getElementById("certificate-categories");
    if (!container) return;

    try {
        container.innerHTML = "<p>Step 1...</p>";

        const branch = await getDefaultBranch();
        container.innerHTML += `<p>Branch: ${branch}</p>`;

        const rootItems = await getFolderContents("", branch);
        container.innerHTML += `<p>Root items: ${rootItems.length}</p>`;

        const folders = rootItems.filter(item => item.type === "dir");
        container.innerHTML += `<p>Folders: ${folders.length}</p>`;

        for (const folder of folders) {
            container.innerHTML += `<p>Checking ${folder.name}...</p>`;

            const pdfs = await collectPdfsFromFolder(folder.path, branch);

            container.innerHTML += `<p>${folder.name}: ${pdfs.length} PDF(s)</p>`;
        }

        container.innerHTML += "<p>Finished successfully.</p>";

    } catch (e) {
        container.innerHTML += `<p style="color:red;">${e.message}</p>`;
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", loadCertificates);
