// Inlines Bootstrap 4 CSS into src/karaoke-sync.html and writes:
//   index.html          full standalone page (GitHub Pages / any static host)
//   build/artifact.html body-only page for publishing as a Claude artifact
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const css = readFileSync("node_modules/bootstrap/dist/css/bootstrap.min.css", "utf8")
  .replace(/\/\*# sourceMappingURL=.*?\*\//g, "");
const src = readFileSync("src/karaoke-sync.html", "utf8");
if (!src.includes("/*BOOTSTRAP*/")) throw new Error("Placeholder /*BOOTSTRAP*/ not found in src/karaoke-sync.html");
const body = src.replace("/*BOOTSTRAP*/", () => css);

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
</head>
<body>
${body}
</body>
</html>
`;

writeFileSync("index.html", page);
mkdirSync("build", { recursive: true });
writeFileSync("build/artifact.html", body);
console.log(`index.html ${page.length} bytes, build/artifact.html ${body.length} bytes`);
