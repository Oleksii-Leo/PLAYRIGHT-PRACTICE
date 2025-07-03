import { test as base, Page } from "@playwright/test";
import GaragePage from "../pom/pages/GaragePage";
import HomePage from "../pom/pages/HomePage";
import SignInForm from "../pom/forms/SignInForm";
import { usersList } from "../test-data/users";

type PageFixtures = {
  garagePage: GaragePage;
  garageAsUserWithRemovingCars: GaragePage;
  garageAsUserStorageState: GaragePage;
};

export const test = base.extend<PageFixtures>({
  garagePage: async ({ page }, use) => {
    let garagePage = new GaragePage(page);
    await use(garagePage);
  },
  garageAsUserWithRemovingCars: async ({ page }, use) => {
    let homePage = new HomePage(page);
    let signInForm = new SignInForm(page);
    let garagePage = new GaragePage(page);

    await homePage.open();
    await homePage.clickSignInButton();
    await signInForm.loginWithCredentials(
      usersList.mainUser.email,
      usersList.mainUser.password
    );
    await garagePage.verifyPageIsOpen();
    await use(garagePage);
    await page.locator('//span[@class="icon icon-edit"]').first().click();
    await page.locator('//button[@class="btn btn-outline-danger"]').click();
    await page.locator('//button[@class="btn btn-danger"]').click();
  },

  garageAsUserStorageState: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "test-data/states/mainUserState.json",
    });
    const page = await context.newPage();
    const garagePage = new GaragePage(page);
    await garagePage.open();
    await garagePage.verifyPageIsOpen();
    await use(garagePage);
    await context.close();
  },
});

export { expect } from "@playwright/test";
