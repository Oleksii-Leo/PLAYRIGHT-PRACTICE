import { test, expect } from "@playwright/test";

const generateEmail = () => `aqa+user${Date.now()}@gmail.com`;

test.describe("[smoke] Registration tests", () => {
  test("Positive: valid registration", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();

    await page.fill("#signupName", "John");
    await page.fill("#signupLastName", "Walker");
    await page.fill("#signupEmail", generateEmail());
    await page.fill("#signupPassword", "Qwerty123");
    await page.fill("#signupRepeatPassword", "Qwerty123");

    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByText("Add car")).toBeVisible();
  });

  test("Negative: empty name", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();

    await page.focus("#signupName");
    await page.focus("#signupLastName"); // blur name
    await page.fill("#signupLastName", "Walker");
    await page.fill("#signupEmail", generateEmail());
    await page.fill("#signupPassword", "Qwerty123");
    await page.fill("#signupRepeatPassword", "Qwerty123");

    await expect(
      page.getByText("Name required", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeDisabled();
  });

  test("Negative: invalid email format", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();

    await page.fill("#signupName", "John");
    await page.fill("#signupLastName", "Walker");
    await page.fill("#signupEmail", "wrongEmail"); // ❌ Невалидный email
    await page.fill("#signupPassword", "Qwerty123");
    await page.fill("#signupRepeatPassword", "Qwerty123");

    await page.locator("#signupEmail").blur(); // Триггер валидации

    await expect(
      page.locator("p", { hasText: "Email is incorrect" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeDisabled();
  });

  test("Negative: password too weak", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();

    await page.fill("#signupName", "John");
    await page.fill("#signupLastName", "Walker");
    await page.fill("#signupEmail", generateEmail());
    await page.fill("#signupPassword", "qw1");
    await page.fill("#signupRepeatPassword", "qw1");

    await page.locator("#signupPassword").blur();

    await expect(
      page.getByText(
        "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter",
        { exact: true }
      )
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeDisabled();
  });

  test("Negative: passwords do not match", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();

    await page.fill("#signupName", "Test");
    await page.fill("#signupLastName", "User");
    await page.fill("#signupEmail", generateEmail());
    await page.fill("#signupPassword", "Qwerty123");
    await page.fill("#signupRepeatPassword", "Different123");

    await page.locator("#signupRepeatPassword").blur();

    await expect(
      page.locator("p", { hasText: "Passwords do not match" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeDisabled();
  });

  test("Negative: all fields empty", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();

    await page.focus("#signupName");
    await page.focus("#signupLastName");
    await page.focus("#signupEmail");
    await page.focus("#signupPassword");
    await page.focus("#signupRepeatPassword");
    await page.locator("#signupRepeatPassword").blur();

    await expect(
      page.getByText("Name required", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText("Last name required", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText("Email required", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText("Password required", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText("Re-enter password required", { exact: true })
    ).toBeVisible();

    await expect(page.getByRole("button", { name: "Register" })).toBeDisabled();
  });
});
