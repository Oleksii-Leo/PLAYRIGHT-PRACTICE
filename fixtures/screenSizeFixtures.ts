import { test as base, Page } from "@playwright/test";

type MyFixtures = {
  smallScreen: Page;
  mediumScreen: Page;
  bigScreen: Page;
};

export const test = base.extend<MyFixtures>({
  smallScreen: async ({ page }, use) => {
    await page.setViewportSize({ width: 300, height: 300 });
    await use(page);
    console.log("This is a smallScreen fixture");
  },

  mediumScreen: async ({ page }, use) => {
    await page.setViewportSize({ width: 800, height: 800 });
    console.log("This is a mediumScreen fixture");
    await use(page);
  },

  bigScreen: async ({ page }, use) => {
    await page.setViewportSize({ width: 1300, height: 1300 });
    await use(page);
    console.log("This is a bigScreen fixture");
  },
});

export { expect } from "@playwright/test";
