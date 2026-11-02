import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const skipped = new Set([
  ".git", ".next", "out", "node_modules", "coverage",
  "playwright-report", "test-results", ".temp", ".branches",
]);
const textExtensions = new Set([
  ".ts", ".tsx", ".js", ".mjs", ".json", ".css", ".sql", ".toml",
  ".md", ".yml", ".yaml", ".html", ".example",
]);

async function inspect(directory) {
  const violations = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (skipped.has(entry.name) || entry.name === "package-lock.json") continue;
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      violations.push(...await inspect(filename));
    } else if (entry.isFile() && textExtensions.has(path.extname(entry.name))) {
      const content = await readFile(filename, "utf8");
      const lines = content.split("\n").length - Number(content.endsWith("\n"));
      if (lines > 500) violations.push(`${filename}: ${lines} lines`);
    }
  }
  return violations;
}

const violations = await inspect(".");
if (violations.length) {
  console.error("Files exceed the 500-line limit:\n" + violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All maintained text/source files are at most 500 lines.");
}
