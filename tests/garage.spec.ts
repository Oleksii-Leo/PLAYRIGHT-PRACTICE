import test from "@playwright/test";
import GaragePage from "../pom/pages/GaragePage";
import SignInForm from "../pom/forms/SignInForm";
import HomePage from "../pom/pages/HomePage";
import { usersList } from "../test-data/users";

let garagePage: GaragePage;
let signinForm: SignInForm;
let homePage: HomePage;

test.describe("Garage Page tests", () => {
  test.use({ storageState: "test-data/states/mainUserState.json" });

  test.beforeEach(async ({ page }) => {
    garagePage = new GaragePage(page);
    signinForm = new SignInForm(page);
    homePage = new HomePage(page);

    //await homePage.open();
    //await homePage.clickSignInButton();
    //await signinForm.loginWithCredentials(
    usersList.mainUser.email, usersList.mainUser.password;
    //);
    //await garagePage.verifyPageIsOpen();
    await garagePage.open();
  });

  test("Add BMW X5 to Garage", async () => {
    await garagePage.addNewCar("BMW", "X5", "333");
    await garagePage.verifyLastAddedCarName("BMW X5");
  });
});
