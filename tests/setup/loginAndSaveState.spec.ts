import test, { expect, Locator } from "@playwright/test";
import { usersList } from "../../test-data/users";
import HomePage from "../../pom/pages/HomePage";
import SignInForm from "../../pom/forms/SignInForm";
import GaragePage from "../../pom/pages/GaragePage";
let homePage: HomePage;
let signInForm: SignInForm;
let garagePage: GaragePage;

test.describe("Login to users and save states", () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInForm = new SignInForm(page);
    garagePage = new GaragePage(page);

    await homePage.open();
    await homePage.clickSignInButton();
  });

  test("Successful sign in", async ({ page }) => {
    await signInForm.loginWithCredentials(
      usersList.mainUser.email,
      usersList.mainUser.password
    );
    await garagePage.verifyPageIsOpen();
    await page
      .context()
      .storageState({ path: "test-data/states/mainUserState.json" });
  });
});
