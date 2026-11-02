import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const output = fileURLToPath(new URL("../out/", import.meta.url));
const basePath = process.env.PAGES_BASE_PATH ?? "/parentspal";
const port = Number(process.env.PORT ?? 3101);
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

await readFile(path.join(output, "index.html"));

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (basePath && pathname === basePath) {
      response.writeHead(308, { Location: `${basePath}/` }).end();
      return;
    }
    if (!pathname.startsWith(`${basePath}/`)) {
      response.writeHead(404).end("Not found");
      return;
    }
    const relative = pathname.slice(basePath.length + 1);
    const filename = path.resolve(output, relative + (pathname.endsWith("/") ? "index.html" : ""));
    if (!filename.startsWith(output) || relative.includes("\0")) {
      response.writeHead(400).end("Invalid path");
      return;
    }
    const body = await readFile(filename);
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filename)] ?? "application/octet-stream",
    }).end(body);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "EISDIR") {
      response.writeHead(404).end("Not found");
    } else if (error instanceof URIError || error instanceof TypeError) {
      response.writeHead(400).end("Invalid request");
    } else {
      console.error(error);
      response.writeHead(500).end("Unable to serve the export");
    }
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Static export: http://127.0.0.1:${port}${basePath}/`);
});
