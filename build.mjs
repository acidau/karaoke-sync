// index.html is the source page (Bootstrap 4.6.2 CSS is already inlined in it).
// This writes build/artifact.html: the contents of index.html's <body>, for publishing as a Claude artifact.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const page = readFileSync("index.html", "utf8");
const m = page.match(/<body[^>]*>\r?\n?([\s\S]*?)\r?\n?<\/body>/i);
if (!m) throw new Error("No <body>…</body> found in index.html");
const body = m[1];

mkdirSync("build", { recursive: true });
writeFileSync("build/artifact.html", body);
console.log(`build/artifact.html ${body.length} bytes (from index.html)`);
