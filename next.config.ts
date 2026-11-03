import type { NextConfig } from "next";

const githubPages = process.env.PARENTSPAL_BUILD_TARGET === "github-pages";
const basePath = githubPages ? (process.env.PAGES_BASE_PATH ?? "/parentspal") : "";

const config: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  ...(githubPages ? {
    output: "export",
    basePath,
    images: { unoptimized: true },
  } : {}),
  env: {
    PARENTSPAL_BUILD_TARGET: githubPages ? "github-pages" : "server",
    PARENTSPAL_BASE_PATH: basePath,
  },
};

export default config;
