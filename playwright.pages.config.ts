import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

const basePath = process.env.PAGES_BASE_PATH ?? "/parentspal";
const baseURL = `http://127.0.0.1:3101${basePath}/`;

export default defineConfig(config, {
  use: { baseURL },
  webServer: {
    command: "npm run preview:pages",
    url: baseURL,
    reuseExistingServer: false,
    env: { PAGES_BASE_PATH: basePath, PORT: "3101" },
    timeout: 30_000,
  },
});
