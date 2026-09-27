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
// LOCAL CACHE HELPERS (certificates-specific names to avoid
// clashing with script.js, since both files share one global
// scope as plain <script> tags)
// ==========================
const CERT_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function certReadCacheEntry(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.timestamp !== "number") return null;
        return parsed;
    } catch (error) {
        return null;
    }
}

function certGetFreshCache(key, ttlMs) {
    const entry = certReadCacheEntry(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > ttlMs) return null;
    return entry.value;
}

function certGetStaleCache(key) {
    const entry = certReadCacheEntry(key);
    return entry ?
