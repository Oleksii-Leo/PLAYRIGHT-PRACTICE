import { test } from "@playwright/test";
import HomePage from "../pom/pages/HomePage";
import RegistrationPage from "../pom/pages/RegistrationPage";

const generateEmail = () => `aqa+user${Date.now()}@gmail.com`;

test.describe("[smoke] Registration tests with POM", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.clickSignInButton();
  });

  test("Positive: valid registration", async ({ page }) => {
    const regPage = new RegistrationPage(page);
    await regPage.openRegistrationForm();

    await regPage.fillName("John");
    await regPage.fillLastName("Walker");
    await regPage.fillEmail(generateEmail());
    await regPage.fillPassword("Qwerty123");
    await regPage.fillRepeatPassword("Qwerty123");
    await regPage.submit();

    await regPage.expectAddCarVisible();
  });

  test("Negative: empty name", async ({ page }) => {
    const regPage = new RegistrationPage(page);
    await regPage.openRegistrationForm();

    await regPage.fillName(""); // фокус для блёра
    await page.locator("#signupName").focus();
    await page.locator("#signupLastName").focus();

    await regPage.fillLastName("Walker");
    await regPage.fillEmail(generateEmail());
    await regPage.fillPassword("Qwerty123");
    await regPage.fillRepeatPassword("Qwerty123");

    await regPage.expectErrorVisible("Name required");
    await regPage.expectRegisterDisabled();
  });

  test("Negative: invalid email format", async ({ page }) => {
    const regPage = new RegistrationPage(page);
    await regPage.openRegistrationForm();

    await regPage.fillName("John");
    await regPage.fillLastName("Walker");
    await regPage.fillEmail("wrongEmail");
    await regPage.fillPassword("Qwerty123");
    await regPage.fillRepeatPassword("Qwerty123");

    await page.locator("#signupEmail").blur();

    await regPage.expectErrorVisible("Email is incorrect");
    await regPage.expectRegisterDisabled();
  });

  test("Negative: password too weak", async ({ page }) => {
    const regPage = new RegistrationPage(page);
    await regPage.openRegistrationForm();

    await regPage.fillName("John");
    await regPage.fillLastName("Walker");
    await regPage.fillEmail(generateEmail());
    await regPage.fillPassword("qw1");
    await regPage.fillRepeatPassword("qw1");

    await page.locator("#signupPassword").blur();

    await regPage.expectErrorVisible(
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
    );
    await regPage.expectRegisterDisabled();
  });

  test("Negative: passwords do not match", async ({ page }) => {
    const regPage = new RegistrationPage(page);
    await regPage.openRegistrationForm();

    await regPage.fillName("Test");
    await regPage.fillLastName("User");
    await regPage.fillEmail(generateEmail());
    await regPage.fillPassword("Qwerty123");
    await regPage.fillRepeatPassword("Different123");

    await page.locator("#signupRepeatPassword").blur();

    await regPage.expectErrorVisible("Passwords do not match");
    await regPage.expectRegisterDisabled();
  });

  test("Negative: all fields empty", async ({ page }) => {
    const regPage = new RegistrationPage(page);
    await regPage.openRegistrationForm();

    await page.locator("#signupName").focus();
    await page.locator("#signupLastName").focus();
    await page.locator("#signupEmail").focus();
    await page.locator("#signupPassword").focus();
    await page.locator("#signupRepeatPassword").focus();
    await page.locator("#signupRepeatPassword").blur();

    await regPage.expectErrorVisible("Name required");
    await regPage.expectErrorVisible("Last name required");
    await regPage.expectErrorVisible("Email required");
    await regPage.expectErrorVisible("Password required");
    await regPage.expectErrorVisible("Re-enter password required");
    await regPage.expectRegisterDisabled();
  });
});
