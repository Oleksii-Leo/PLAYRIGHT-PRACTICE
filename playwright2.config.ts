import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// загружаем переменные из .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    httpCredentials: {
      username: process.env.HTTP_CREDENTIALS_USERNAME!,
      password: process.env.HTTP_CREDENTIALS_PASSWORD!,
    },
  },
  projects: [
    {
      name: "smoke",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  testDir: "./tests",
  reporter: "html",
  retries: 4,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
});
