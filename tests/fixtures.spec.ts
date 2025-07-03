import { chromium } from "@playwright/test";
// import { test } from "../fixtures/screenSizeFixtures"
import { test } from "../fixtures/fixtures";

// let homePage: HomePage;
// let signInForm: SignInForm;

test("Open wikipedia page without fixture", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.wikipedia.org/");
});

test.describe("using fixtures", () => {
  // test('Open wikipedia via smallScreen', async ({ smallScreen }) => {
  //     await smallScreen.goto('https://www.wikipedia.org/');
  //     await smallScreen.waitForTimeout(2000);
  // })

  // test('Open wikipedia via mediumScreen', async ({ mediumScreen }) => {
  //     await mediumScreen.goto('https://www.wikipedia.org/');
  //     await mediumScreen.waitForTimeout(2000);
  // })

  // test('Open wikipedia via bigScreen', async ({ bigScreen }) => {
  //     await bigScreen.goto('https://www.wikipedia.org/');
  //     await bigScreen.waitForTimeout(2000);
  // })

  test.describe("QA Auto site", () => {
    // test('Open GaragePage', async ({ garagePage }) => {
    //     await garagePage.verifyPageIsOpen();
    // })

    test("Add BMW X5", async ({
      garageAsUserWithRemovingCars,
      smallScreen,
    }) => {
      await garageAsUserWithRemovingCars.verifyPageIsOpen();
      await garageAsUserWithRemovingCars.addNewCar("BMW", "X5", "999");
      await garageAsUserWithRemovingCars.verifyLastAddedCarName("BMW X5");
    });

    test("Add Audi A8", async ({ garageAsUserWithRemovingCars, bigScreen }) => {
      await garageAsUserWithRemovingCars.verifyPageIsOpen();
      await garageAsUserWithRemovingCars.addNewCar("Audi", "A8", "999");
      await garageAsUserWithRemovingCars.verifyLastAddedCarName("Audi A8");
    });

    test("Add Audi A8 with state", async ({ garageAsUserStorageState }) => {
      await garageAsUserStorageState.verifyPageIsOpen();
      await garageAsUserStorageState.addNewCar("Audi", "A8", "999");
      await garageAsUserStorageState.verifyLastAddedCarName("Audi A8");
    });
  });
});
