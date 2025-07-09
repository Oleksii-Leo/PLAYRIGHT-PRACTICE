import test, { expect, Locator } from "@playwright/test";
import { usersList } from "../../test-data/users";
import HomePage from "../../pom/pages/HomePage";
import SignInForm from "../../pom/forms/SignInForm";
let homePage: HomePage;
let signInForm: SignInForm;

test.describe("With POM", () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInForm = new SignInForm(page);
    await test.step("Open Home Page and Sign in", async () => {
      await homePage.open();
      await homePage.clickSignInButton();
    });
  });

  test("Successful sign in", async ({ page }) => {
    await signInForm.loginWithCredentials(
      usersList.mainUser.email,
      usersList.mainUser.password
    );
    await test.step("Verify Garage Page is open", async () => {
      await expect(page.locator("h1", { hasText: "Garage" })).toBeVisible();
    });
  });

  test("Sign in without email", async () => {
    await signInForm.triggerEmptyErrorOnField("email");
    await signInForm.verifyErrorIsDisplayed("Email required");
  });

  test("Sign in without password", async () => {
    await signInForm.triggerEmptyErrorOnField("password");
    await signInForm.verifyErrorIsDisplayed("Password required");
  });

  test("Sign in with incorrect email", async () => {
    await signInForm.enterEmail("fsagsaga");
    await signInForm.triggerEmptyErrorOnField("email");
    await signInForm.verifyErrorIsDisplayed("Email is incorrect");
  });
});

test.describe("Without POM", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test.describe("Sign in tests", () => {
    let signInButton: Locator;
    let emailField: Locator;
    let passwordField: Locator;
    let loginButton: Locator;

    test.beforeEach(({ page }) => {
      signInButton = page.locator('//button[contains(@class,"header_signin")]');
      emailField = page.getByRole("textbox", { name: "Email" });
      passwordField = page.getByRole("textbox", { name: "Password" });
      loginButton = page.getByText("Login");
    });

    test("Successful sign in 1", async ({ page }) => {
      // const modelDropdown = page.locator('#addModelDropdown').or(page.locator('#editModelDropdown'));

      await signInButton.click();
      await emailField.fill(usersList.mainUser.email);
      await passwordField.pressSequentially(usersList.mainUser.password, {
        delay: 50,
      });
      await loginButton.click();
      await expect(page.locator("h1", { hasText: "Garage" })).toBeVisible();
    });

    test("Successful sign in 2", async ({ page }) => {
      // const modelDropdown = page.locator('#addModelDropdown').or(page.locator('#editModelDropdown'));

      await signInButton.click();
      await emailField.fill(usersList.mainUser.email);
      await passwordField.pressSequentially(usersList.mainUser.password, {
        delay: 50,
      });
      await loginButton.click();
      await expect(page.locator("h1", { hasText: "Garage" })).toBeVisible();
    });

    test("Successful sign in 3", async ({ page }) => {
      // const modelDropdown = page.locator('#addModelDropdown').or(page.locator('#editModelDropdown'));

      await signInButton.click();
      await emailField.fill(usersList.mainUser.email);
      await passwordField.pressSequentially(usersList.mainUser.password, {
        delay: 50,
      });
      await loginButton.click();
      await expect(page.locator("h1", { hasText: "Garage" })).toBeVisible();
    });
  });
});
