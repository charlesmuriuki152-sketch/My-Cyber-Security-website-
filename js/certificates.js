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

    return await fetchJson(url);
}

async function collectPdfsFromFolder(folderPath, branch) {
    const items = await getFolderContents(folderPath, branch);

    let pdfs = [];

    for (const item of items) {

        if (
            item.type === "file" &&
            item.name.toLowerCase().endsWith(".pdf")
        ) {
            pdfs.push({
                title: cleanTitle(item.name),
                path: item.path,
                html_url: item.html_url
            });
        }

        if (item.type === "dir") {
            const nested = await collectPdfsFromFolder(
                item.path,
                branch
            );

            pdfs = pdfs.concat(nested);
        }
    }

    return pdfs;
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
    link.textContent = "View on GitHub";

    // Only trust URLs that actually point to github.com,
    // since this value ultimately comes from repo content.
    if (
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

async function loadCertificates() {

    const container =
        document.getElementById("certificate-categories");

    if (!container) {

        console.error(
            "Certificate container #certificate-categories not found."
        );

        return;
    }

    const loadingMsg = document.createElement("p");
    loadingMsg.className = "certificate-loading";
    loadingMsg.textContent = "Loading certificates...";
    container.innerHTML = "";
    container.appendChild(loadingMsg);

    try {

        const branch =
            await getDefaultBranch();

        const rootItems =
            await getFolderContents("", branch);

        const folders =
            rootItems.filter(
                item => item.type === "dir"
            );

        container.innerHTML = "";

        for (const folder of folders) {

            const pdfs =
                await collectPdfsFromFolder(
                    folder.path,
                    branch
                );

            if (pdfs.length === 0) {
                continue;
            }

            const card =
                createCategoryCard(
                    folder.name,
                    pdfs
                );

            container.appendChild(card);
        }

        if (container.children.length === 0) {

            const emptyMsg = document.createElement("p");
            emptyMsg.textContent = "No certificates found.";
            container.appendChild(emptyMsg);
        }

    } catch (error) {

        console.error(
            "Certificate Engine Error:",
            error
        );

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
