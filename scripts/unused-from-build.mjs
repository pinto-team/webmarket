import fs from "fs";
import path from "path";

const projectRoot = process.cwd();

function walk(dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walk(p));
        else out.push(p);
    }
    return out;
}

const used = new Set(
    JSON.parse(fs.readFileSync("used-files.from-build.json", "utf8"))
);

const all = walk(path.join(projectRoot, "src"))
    .map((p) => path.relative(projectRoot, p).replaceAll("\\", "/"))
    .filter((p) => !p.includes("/__tests__/"))
    .filter((p) => !p.endsWith(".d.ts"));

const unused = all.filter((p) => !used.has(p)).sort();

fs.writeFileSync("unused-files.from-build.json", JSON.stringify(unused, null, 2), "utf8");

console.log("✅ Wrote unused-files.from-build.json");
console.log("All src files:", all.length);
console.log("Unused (per build):", unused.length);
