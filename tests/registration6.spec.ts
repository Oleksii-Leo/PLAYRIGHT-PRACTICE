import { test, expect } from "@playwright/test";
//new
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
    await page.focus("#signupLastName");
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
    await page.fill("#signupEmail", "wrongEmail");
    await page.fill("#signupPassword", "Qwerty123");
    await page.fill("#signupRepeatPassword", "Qwerty123");
    await page.locator("#signupEmail").blur();

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

  test("Negative: name too short", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupName", "J");
    await page.locator("#signupName").blur();
    await expect(
      page.getByText("Name has to be from 2 to 20 characters long")
    ).toBeVisible();
  });

  test("Negative: name too long", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupName", "J".repeat(21));
    await page.locator("#signupName").blur();
    await expect(
      page.getByText("Name has to be from 2 to 20 characters long")
    ).toBeVisible();
  });

  test("Negative: last name too short", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupLastName", "A");
    await page.locator("#signupLastName").blur();
    await expect(
      page.getByText("Last name has to be from 2 to 20 characters long")
    ).toBeVisible();
  });

  test("Negative: last name too long", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupLastName", "A".repeat(21));
    await page.locator("#signupLastName").blur();
    await expect(
      page.getByText("Last name has to be from 2 to 20 characters long")
    ).toBeVisible();
  });

  test("Negative: last name with special characters", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupLastName", "@#$%");
    await page.locator("#signupLastName").blur();
    await expect(page.getByText("Last name is invalid")).toBeVisible();
  });

  test("Negative: email field empty", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.locator("#signupEmail").focus();
    await page.locator("#signupPassword").focus();
    await expect(page.getByText("Email required")).toBeVisible();
  });

  test("Negative: email without domain", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupEmail", "user@");
    await page.locator("#signupEmail").blur();
    await expect(page.getByText("Email is incorrect")).toBeVisible();
  });

  test("Negative: email without @", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupEmail", "userexample.com");
    await page.locator("#signupEmail").blur();
    await expect(page.getByText("Email is incorrect")).toBeVisible();
  });

  test("Negative: email with spaces", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupEmail", " user@example.com ");
    await page.locator("#signupEmail").blur();
    await expect(page.getByText("Email is incorrect")).toBeVisible();
  });

  test("Negative: password without number", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupPassword", "QwertyQwerty");
    await page.locator("#signupPassword").blur();
    await expect(
      page.getByText("Password has to be from 8 to 15 characters long")
    ).toBeVisible();
  });

  test("Negative: password without uppercase", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupPassword", "qwerty123");
    await page.locator("#signupPassword").blur();
    await expect(
      page.getByText("Password has to be from 8 to 15 characters long")
    ).toBeVisible();
  });

  test("Negative: password without lowercase", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupPassword", "QWERTY123");
    await page.locator("#signupPassword").blur();
    await expect(
      page.getByText("Password has to be from 8 to 15 characters long")
    ).toBeVisible();
  });

  test("Negative: password too short", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupPassword", "Q1a");
    await page.locator("#signupPassword").blur();
    await expect(
      page.getByText("Password has to be from 8 to 15 characters long")
    ).toBeVisible();
  });

  test("Negative: password too long", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupPassword", "Qwerty1234567890");
    await page.locator("#signupPassword").blur();
    await expect(
      page.getByText("Password has to be from 8 to 15 characters long")
    ).toBeVisible();
  });

  test("Negative: re-enter password empty", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupPassword", "Qwerty123");
    await page.locator("#signupRepeatPassword").focus();
    await page.locator("#signupName").focus();
    await expect(page.getByText("Re-enter password required")).toBeVisible();
  });

  test("Negative: name with numbers", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupName", "John123");
    await page.locator("#signupName").blur();
    await expect(page.getByText("Name is invalid")).toBeVisible();
  });

  test("Negative: last name with numbers", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupLastName", "Doe456");
    await page.locator("#signupLastName").blur();
    await expect(page.getByText("Last name is invalid")).toBeVisible();
  });

  test("Negative: name with leading/trailing spaces", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupName", "   John   ");
    await page.locator("#signupName").blur();
    await expect(page.getByText("Name is invalid")).toBeVisible();
  });

  test("Negative: name with special characters", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Registration" }).click();
    await page.fill("#signupName", "J@hn!");
    await page.locator("#signupName").blur();
    await expect(page.getByText("Name is invalid")).toBeVisible();
  });
});
