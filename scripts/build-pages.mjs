import { cp, mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const workspace = await mkdtemp(path.join(tmpdir(), "parentspal-pages-"));

try {
  for (const filename of [
    "src", "public", "package.json", "next.config.ts",
    "postcss.config.mjs", "tsconfig.json",
  ]) {
    await cp(path.join(root, filename), path.join(workspace, filename), { recursive: true });
  }
  await symlink(path.join(root, "node_modules"), path.join(workspace, "node_modules"), "junction");
  const code = await new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "build", "--", "--webpack"], {
      cwd: workspace,
      stdio: "inherit",
      env: {
        ...process.env,
        PARENTSPAL_BUILD_TARGET: "github-pages",
        PARENTSPAL_DATA_MODE: "demo",
      },
    });
    child.on("error", reject);
    child.on("exit", (status) => resolve(status ?? 1));
  });
  if (code !== 0) {
    process.exitCode = code;
  } else {
    const output = path.join(root, "out");
    await rm(output, { recursive: true, force: true });
    await cp(path.join(workspace, "out"), output, { recursive: true });
    console.log("GitHub Pages export written to out/. The server build is unchanged.");
  }
} finally {
  await rm(workspace, { recursive: true, force: true });
}
