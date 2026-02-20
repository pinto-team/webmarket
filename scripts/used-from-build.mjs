import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const nextServerDir = path.join(projectRoot, ".next", "server");

function walk(dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walk(p));
        else out.push(p);
    }
    return out;
}

function isInsideProject(p) {
    const rel = path.relative(projectRoot, p);
    return rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

const traceFiles = walk(nextServerDir).filter((p) => p.endsWith(".nft.json"));

if (traceFiles.length === 0) {
    console.error("No *.nft.json found. Make sure you ran `next build` and outputFileTracing is enabled (default).");
    process.exit(1);
}

const usedAbs = new Set();

for (const tf of traceFiles) {
    try {
        const json = JSON.parse(fs.readFileSync(tf, "utf8"));
        const files = Array.isArray(json.files) ? json.files : [];
        for (const f of files) usedAbs.add(path.isAbsolute(f) ? f : path.join(projectRoot, f));
    } catch (e) {
        console.warn("Failed to parse:", tf);
    }
}

// فقط فایل‌های داخل پروژه (نه node_modules/system)
const usedProject = [...usedAbs]
    .filter(isInsideProject)
    .map((p) => path.relative(projectRoot, p).replaceAll("\\", "/"))
    .sort();

fs.writeFileSync("used-files.from-build.json", JSON.stringify(usedProject, null, 2), "utf8");

console.log("✅ Wrote used-files.from-build.json");
console.log("Used project files:", usedProject.length);
