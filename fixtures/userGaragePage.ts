import { test as base, Page } from "@playwright/test";
import GaragePage from "../pom/pages/GaragePage";

type Fixtures = {
  userGaragePage: GaragePage;
  page: Page; // page як фікстура для правильного контексту
};

export const test = base.extend<Fixtures>({
  userGaragePage: async ({ browser }, use, workerInfo) => {
    const context = await browser.newContext({
      storageState: "test-data/states/mainUserState.json",
    });
    const page = await context.newPage(); // новий page із storageState
    const garagePage = new GaragePage(page);

    await garagePage.open();
    await use(garagePage);
  },
});
