import test, { expect } from "@playwright/test";

test("Verify empty carList", async ({ page }) => {
  await page.goto("");
  await page.getByText("Guest log in").click();
  await expect(
    page.locator('//div[@class="panel-page_empty panel-empty"]')
  ).toBeVisible();
});

test("Hello from console", async ({ page }) => {
  await page.goto("");
  await page.evaluate(() => {
    console.log("Hello from browser");
  });
});

test("Get gustData and verify", async ({ page }) => {
  await page.goto("");
  await page.getByText("Guest log in").click();
  await expect(
    page.locator('//div[@class="panel-page_empty panel-empty"]')
  ).toBeVisible();
  let guestData = await page.evaluate(() => {
    return window.sessionStorage.getItem("guestData");
  });
  let obj = JSON.parse(guestData!);

  expect(obj.expenses).toHaveLength(0);
});

test("Change gustData and verify", async ({ page }) => {
  const savedData = {
    expenses: [],
    cars: [
      {
        id: 1,
        brand: "Audi",
        model: "Q7",
        logo: "audi.png",
        initialMileage: 42,
        updatedMileageAt: "2025-06-26T17:24:05.982Z",
        carCreatedAt: "2025-06-26T17:24:05.982Z",
        carBrandId: 1,
        carModelId: 3,
        mileage: 42,
      },
      {
        id: 2,
        brand: "Porsche",
        model: "Panamera",
        logo: "porsche.png",
        initialMileage: 41,
        updatedMileageAt: "2025-06-26T17:24:10.201Z",
        carCreatedAt: "2025-06-26T17:24:10.201Z",
        carBrandId: 4,
        carModelId: 18,
        mileage: 41,
      },
    ],
    nextCarId: 3,
    nextExpenseId: 1,
  };
  await page.goto("");
  await page.evaluate((data) => {
    window.sessionStorage.setItem("guestData", JSON.stringify(data));
  }, savedData);
  await page.getByText("Guest log in").click();
  await expect(
    page.locator('//div[@class="panel-page_empty panel-empty"]')
  ).not.toBeVisible();
});
