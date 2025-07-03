import { chromium } from "@playwright/test";
import { usersList } from "./test-data/users";
import HomePage from "./pom/pages/HomePage";
import SignInForm from "./pom/forms/SignInForm";
import GaragePage from "./pom/pages/GaragePage";

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: "https://qauto.forstudy.space",
  });
  const page = await context.newPage();

  const homePage = new HomePage(page);
  const signInForm = new SignInForm(page);
  const garagePage = new GaragePage(page);

  await page.goto("https://qauto.forstudy.space/"); // ИСПРАВЛЕНО!
  await homePage.clickSignInButton();
  await signInForm.loginWithCredentials(
    usersList.mainUser.email,
    usersList.mainUser.password
  );
  await garagePage.verifyPageIsOpen();

  await context.storageState({ path: "test-data/states/mainUserState.json" });
  await browser.close();
}

export default globalSetup;
