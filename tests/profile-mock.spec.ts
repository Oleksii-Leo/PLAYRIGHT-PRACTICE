import test, { expect } from "@playwright/test";
import { usersList } from "../test-data/users";
import HomePage from "../pom/pages/HomePage";
import SignInForm from "../pom/forms/SignInForm";

let homePage: HomePage;
let signInForm: SignInForm;

test("Подмена имени пользователя на странице профиля", async ({ page }) => {
  homePage = new HomePage(page);
  signInForm = new SignInForm(page);

  let routeTriggered = false;

  // !
  await page.route("**/profile", async (route, request) => {
    // !!
    if (request.headers()["accept"]?.includes("application/json")) {
      routeTriggered = true;

      const mockResponse = {
        status: "ok",
        data: {
          userId: 227751,
          photoFilename: "default-user.png",
          name: "Alex",
          lastName: "Leon 28",
        },
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockResponse),
      });
    } else {
      // !
      await route.continue();
    }
  });

  // Log in
  await homePage.open();
  await homePage.clickSignInButton();
  await page.locator("app-signin-modal").waitFor({ state: "visible" });

  await signInForm.loginWithCredentials(
    usersList.mainUser.email,
    usersList.mainUser.password
  );

  await expect(page).toHaveURL(/.*garage/);

  // !!
  await page.goto("/panel/profile");

  // Проверка, что подмена реально сработала
  expect(routeTriggered).toBe(true);

  // Проверка имени
  const nameLocator = page.locator(".profile_name");
  await expect(nameLocator).toHaveText("Alex Leon 28");
});
