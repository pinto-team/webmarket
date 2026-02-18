import fs from "fs";
import path from "path";

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, "src");
const RESOURCE_FILE = path.join(SRC_DIR, "i18n", "resource.ts");

// ---- 1) load resources.ts (by simple eval-ish import via dynamic import of transpiled TS is hard)
// راه ساده و تمیز: با tsx اجراش کن تا TS رو مستقیم import کنه
// npm i -D tsx
const { resources } = await import(pathToFileUrl(RESOURCE_FILE).toString());

// ---- helpers
function pathToFileUrl(p) {
    const url = new URL("file://");
    url.pathname = p.replace(/\\/g, "/");
    if (!url.pathname.startsWith("/")) url.pathname = "/" + url.pathname;
    return url;
}

function flatten(obj, prefix = "") {
    const out = [];
    for (const [k, v] of Object.entries(obj || {})) {
        const next = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === "object" && !Array.isArray(v)) out.push(...flatten(v, next));
        else out.push(next);
    }
    return out;
}

function walk(dir) {
    const out = [];
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) out.push(...walk(p));
        else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) out.push(p);
    }
    return out;
}

// ---- 2) defined keys (assumes resources[lang].translation)
const defined = new Set();
for (const [lang, pack] of Object.entries(resources || {})) {
    const keys = flatten(pack?.translation || {});
    keys.forEach((k) => defined.add(k));
}

// ---- 3) used keys (t("x.y") + i18n.t("x.y") + <Trans i18nKey="x.y" />)
const used = new Set();
const files = walk(SRC_DIR);

const reT = /\b(?:t|i18n\.t)\(\s*['"`]([^'"`]+)['"`]\s*[,\)]/g;
const reTrans = /\bi18nKey\s*=\s*['"`]([^'"`]+)['"`]/g;

for (const f of files) {
    const s = fs.readFileSync(f, "utf8");
    for (const re of [reT, reTrans]) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(s))) used.add(m[1]);
    }
}

// ---- 4) diff
const missing = [...used].filter((k) => !defined.has(k)).sort();
const unused = [...defined].filter((k) => !used.has(k)).sort();

// ---- 5) output
const outDir = path.join(PROJECT_ROOT, "i18n-audit");
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, "defined.txt"), [...defined].sort().join("\n"));
fs.writeFileSync(path.join(outDir, "used.txt"), [...used].sort().join("\n"));
fs.writeFileSync(path.join(outDir, "missing.txt"), missing.join("\n"));
fs.writeFileSync(path.join(outDir, "unused.txt"), unused.join("\n"));

console.log("✅ i18n audit done");
console.log("defined:", defined.size);
console.log("used   :", used.size);
console.log("missing:", missing.length, "-> i18n-audit/missing.txt");
console.log("unused :", unused.length, "-> i18n-audit/unused.txt");
