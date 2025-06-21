import test, { expect } from "@playwright/test";
import { usersList } from "../test-data/users";

test.beforeEach(async ({ page }) => {
  await page.goto("");
});

test.describe("Sign in tests", () => {
  test("Successful sign in", async ({ page }) => {
    const signInButton = page.locator(
      '//button[contains(@class,"header_signin")]'
    );
    const emailField = page.getByRole("textbox", { name: "Email" });
    const passwordField = page.getByRole("textbox", { name: "Password" });
    const loginButton = page.getByText("Login");

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

test.describe("Practice", () => {
  test("Switch between elements", async ({ page }) => {
    // page.locator('//*[contains(@class, "sidebar_btn")]').first();
    // page.locator('//*[contains(@class, "sidebar_btn")]').last();
    // page.locator('//*[contains(@class, "sidebar_btn")]').nth(2)

    const sideButtons = page.locator('//*[contains(@class, "sidebar_btn")]');
    console.log(await sideButtons.count());

    for (const button of await sideButtons.all()) {
      console.log(await button.innerText());
    }
  });

  test("Text", async ({ page }) => {
    console.log(await page.locator("//h1").textContent());
    console.log(await page.locator("//button").allTextContents());
    await expect(
      page.locator("//h1"),
      `Text is not as expected. Because ${""}`
    ).toHaveText("Do less");
  });

  test("Screenshot testing", async ({ page }) => {
    const signInButton = page.locator(
      '//button[contains(@class,"header_signin")]'
    );
    const emailField = page.getByRole("textbox", { name: "Email" });
    const passwordField = page.getByRole("textbox", { name: "Password" });
    const loginButton = page.getByText("Login");

    // const modelDropdown = page.locator('#addModelDropdown').or(page.locator('#editModelDropdown'));

    await signInButton.click();
    await emailField.fill(usersList.mainUser.email);
    await passwordField.pressSequentially(usersList.mainUser.password, {
      delay: 50,
    });
    await loginButton.click();
    await expect(page.locator("h1", { hasText: "Garage" })).toBeVisible();

    // await expect(page).toHaveScreenshot('GaragePage.png');
    await expect(page.locator("app-car").first()).toHaveScreenshot(
      "LastCar.png"
    );
  });
});
