// ======== CONFIGURE THIS ========
const CONFIG = {
  owner: "cmpiyush",
  repo: "cmpiyush.github.io/cmpiyush_lectures",
  branch: "main",
  rootPath: "History and Evolution of Social Work", // e.g., "notes" if your notes live in /notes
};
// ================================

const els = {
  navContents: document.getElementById("navContents"),
  search: document.getElementById("search"),
  searchResults: document.getElementById("searchResults"),
  content: document.getElementById("content"),
  tocList: document.getElementById("tocList"),
  presentBtn: document.getElementById("presentBtn"),
  themeBtn: document.getElementById("themeBtn")
};
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle
(function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  if (saved === "dark") document.documentElement.classList.add("dark");
  els.themeBtn.textContent = document.documentElement.classList.contains("dark") ? "Light" : "Dark";
  els.themeBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const mode = document.documentElement.classList.contains("dark") ? "dark" : "light";
    els.themeBtn.textContent = mode === "dark" ? "Light" : "Dark";
    localStorage.setItem("theme", mode);
  });
})();

// GitHub helpers
const GH = {
  treeUrl() {
    const {owner, repo, branch} = CONFIG;
    return `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`;
  },
  rawUrl(path) {
    const {owner, repo, branch} = CONFIG;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${path}`;
  },
  async fetchJson(url) {
    const headers = { "Accept": "application/vnd.github+json" };
    const token = localStorage.getItem("gh_pat");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const r = await fetch(url, { headers });
    if (!r.ok) throw new Error(`GitHub API error ${r.status}: ${url}`);
    return r.json();
  },
  async fetchText(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Fetch error ${r.status}: ${url}`);
    return r.text();
  }
};

let fileIndex = [];      // [{ path, name, parts[], titleGuess }]
let nameToPath = new Map(); // "concept of social work" -> "Sem1/MSW 101/Unit 1/Concept of Social Work.md"
let currentNotePath = null;

// Build index + sidebar
(async function init() {
  try {
    const tree = await GH.fetchJson(GH.treeUrl());
    const files = tree.tree.filter(n =>
      n.type === "blob" &&
      n.path.endsWith(".md") &&
      (CONFIG.rootPath ? n.path.startsWith(CONFIG.rootPath + "/") : true)
    );
    // Build file index
    files.forEach(f => {
      const relPath = CONFIG.rootPath ? f.path.slice(CONFIG.rootPath.length + 1) : f.path;
      const parts = relPath.split("/");
      const name = parts[parts.length - 1].replace(/\.md$/i, "");
      fileIndex.push({ path: relPath, name, parts, titleGuess: nameToTitle(name) });
    });

    // Map simplified names to paths (for wiki-links)
    buildNameMap(fileIndex);

    // Build sidebar tree
    const treeRoot = buildTree(fileIndex);
    els.navContents.innerHTML = "";
    els.navContents.appendChild(renderTree(treeRoot));

    // Search setup
    initSearch();

    // If URL has ?path=..., open it
    const url = new URL(location.href);
    const pathQ = url.searchParams.get("path");
    if (pathQ) {
      openNote(decodeURIComponent(pathQ));
    }
  } catch (e) {
    console.error(e);
    els.content.innerHTML = `<p style="color:#c00">Failed to load repository tree. ${e.message}</p>`;
  }
})();

function nameToTitle(name) {
  return name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function buildNameMap(index) {
  nameToPath.clear();
  for (const f of index) {
    const key = f.name.toLowerCase();
    if (!nameToPath.has(key)) nameToPath.set(key, f.path);
    // also map last path segment keys like "unit 1" if it’s a dir index (optional)
  }
}

// Build hierarchical tree from paths
function buildTree(index) {
  const root = { name: "root", type: "folder", children: new Map() };
  for (const f of index) {
    const parts = f.parts;
    let node = root;
    for (let i=0; i<parts.length; i++) {
      const isFile = i === parts.length - 1;
      const part = isFile ? parts[i].replace(/\.md$/i, "") : parts[i];
      if (!node.children.has(part)) {
        node.children.set(part, { name: part, type: isFile ? "file" : "folder", children: new Map(), path: null });
      }
      node = node.children.get(part);
      if (isFile) node.path = f.path;
    }
  }
  return root;
}

function renderTree(node) {
  const ul = document.createElement("ul");
  ul.className = "tree";
  for (const [name, child] of Array.from(node.children.entries())) {
    const li = document.createElement("li");
    if (child.type === "folder") {
      li.className = "folder";
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = name;
      const kids = renderTree(child);
      kids.classList.add("children");
      label.addEventListener("click", () => {
        kids.style.display = kids.style.display === "none" ? "" : "none";
      });
      li.appendChild(label);
      li.appendChild(kids);
    } else {
      li.className = "file";
      const btn = document.createElement("button");
      btn.className = "link";
      btn.textContent = nameToTitle(name);
      btn.addEventListener("click", () => openNote(child.path));
      li.appendChild(btn);
    }
    ul.appendChild(li);
  }
  return ul;
}

async function openNote(path) {
  try {
    currentNotePath = path;
    const rawUrl = GH.rawUrl(CONFIG.rootPath ? `${CONFIG.rootPath}/${path}` : path);
    let md = await GH.fetchText(rawUrl);

    // Preprocess Obsidian syntax
    md = preprocessObsidian(md, path);

    // Render markdown
    marked.setOptions({
      gfm: true,
      breaks: false,
      headerIds: true,
      mangle: false
    });
    const html = marked.parse(md);
    els.content.innerHTML = html;

    // Code highlight, Math
    if (window.hljs) window.hljs.highlightAll();
    if (window.MathJax && window.MathJax.typesetPromise) await MathJax.typesetPromise();

    // Build TOC from h2..h4
    buildTOC();

    // Enable Present button
    els.presentBtn.disabled = false;
    els.presentBtn.onclick = () => {
      const url = `slides.html?path=${encodeURIComponent(path)}`;
      window.open(url, "_blank");
    };

    // Update URL (so you can share direct links)
    const u = new URL(location.href);
    u.searchParams.set("path", path);
    history.replaceState(null, "", u.toString());
  } catch (e) {
    console.error(e);
    els.content.innerHTML = `<p style="color:#c00">Failed to load note. ${e.message}</p>`;
  }
}

function preprocessObsidian(md, notePath) {
  const noteDir = notePath.split("/").slice(0, -1).join("/");

  // 1) Convert Obsidian embeds ![[file.png]] to normal markdown images ![](url)
  md = md.replace(/!\[\[([^|\]]+?)(\|[^|\]]+)?\]\]/g, (m, target) => {
    const resolved = resolveRelative(noteDir, target.trim());
    const url = GH.rawUrl(CONFIG.rootPath ? `${CONFIG.rootPath}/${resolved}` : resolved);
    return `![](${url})`;
  });

  // 2) Convert wiki-links [[Note Name|Alias]] to normal links to open in app
  md = md.replace(/\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (m, target, _p2, alias) => {
    const fileName = target.trim().replace(/\.md$/i, "");
    const path = nameToPath.get(fileName.toLowerCase());
    const text = alias || target;
    if (path) {
      return `[${text}](?path=${encodeURIComponent(path)})`;
    } else {
      return text; // leave as plain text if not found
    }
  });

  // 3) Convert callouts:
  // > [!NOTE] Title
  // > body...
  md = md.replace(/^>\s*\[!([A-Za-z]+)\]\s*(.*)$/gmi, (m, type, title) => {
    const t = title?.trim() || type;
    return `\n<div class="callout callout-${type.toLowerCase()}"><div class="callout-title">${t}</div>`;
  });
  // Close callout when blockquote ends: naive approach
  md = md.replace(/\n(?!> )(.*)\n(?=\S)/g, (m) => m.endsWith("</div>\n") ? m : m);
  // Ensure callouts end where blockquotes stop
  md = md.replace(/\n(?!> ).*$/gm, (line) => line);

  // 4) Fix any in-app links (?path=...) to open inside SPA
  // After rendering, we intercept clicks.

  return md;
}

function resolveRelative(baseDir, rel) {
  if (!baseDir) return rel;
  const base = baseDir.split("/").filter(Boolean);
  const parts = rel.split("/").filter(Boolean);
  const stack = [...base];
  for (const p of parts) {
    if (p === ".") continue;
    if (p === "..") stack.pop();
    else stack.push(p);
  }
  return stack.join("/");
}

// Intercept internal links (?path=...)
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  const url = new URL(a.href, location.origin);
  if (url.searchParams.has("path")) {
    e.preventDefault();
    openNote(url.searchParams.get("path"));
  }
});

// Build TOC from h2..h4
function buildTOC() {
  const headings = els.content.querySelectorAll("h2, h3, h4");
  const list = document.createElement("ul");
  headings.forEach(h => {
    if (!h.id) h.id = h.textContent.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const li = document.createElement("li");
    li.style.marginLeft = h.tagName === "H3" ? "10px" : h.tagName === "H4" ? "20px" : "0";
    const link = document.createElement("a");
    link.href = `#${h.id}`;
    link.textContent = h.textContent;
    li.appendChild(link);
    list.appendChild(li);
  });
  els.tocList.innerHTML = "";
  els.tocList.appendChild(list);
}

// Search (by filename/path; fast and avoids prefetching all content)
function initSearch() {
  const items = fileIndex.map(f => ({
    path: f.path,
    name: f.name,
    title: f.titleGuess,
    joined: f.parts.join(" / ")
  }));

  const fuse = new Fuse(items, {
    includeScore: true,
    keys: ["title", "name", "joined"],
    threshold: 0.4,
    ignoreLocation: true
  });

  els.search.addEventListener("input", () => {
    const q = els.search.value.trim();
    if (!q) {
      els.searchResults.innerHTML = "";
      return;
    }
    const res = fuse.search(q).slice(0, 20);
    els.searchResults.innerHTML = res.map(r =>
      `<li><a href="?path=${encodeURIComponent(r.item.path)}">${escapeHtml(r.item.title)} <span style="color:var(--muted)">— ${escapeHtml(r.item.joined)}</span></a></li>`
    ).join("");
  });

  els.searchResults.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    e.preventDefault();
    const url = new URL(a.href, location.origin);
    openNote(url.searchParams.get("path"));
    els.searchResults.innerHTML = "";
    els.search.value = "";
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
