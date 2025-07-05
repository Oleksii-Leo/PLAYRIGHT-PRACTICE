import test, { expect } from "@playwright/test";
import HomePage from "../pom/pages/HomePage";
import SignInForm from "../pom/forms/SignInForm";
import { usersList } from "../test-data/users";
import AuthController from "../api/controllers/AuthController";

let homePage: HomePage;
let signInForm: SignInForm;
let authController: AuthController;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  signInForm = new SignInForm(page);
});

test("Test page.on", async ({ page }) => {
  page.on("request", (request) =>
    console.log(">>", request.method(), request.url())
  );
  page.on("response", (response) =>
    console.log("<<", response.status(), response.url())
  );
  await page.goto("");
});

test("Mock response", async ({ page }) => {
  await homePage.open();
  await homePage.clickSignInButton();
  // await page.route('/api/cars', route => route.fulfill({
  //     status: 500,
  //     body: '',
  // }));

  await page.route("**/api/cars", async (route) => {
    await route.fulfill({
      status: 404,
      contentType: "text/plain",
      body: "Not Found!",
    });
  });

  await signInForm.loginWithCredentials(
    usersList.mainUser.email,
    usersList.mainUser.password
  );
  await expect(
    page.getByText("You don’t have any cars in your garage")
  ).toBeVisible();

  // await page.route('**/api/cars', async route => {
  //     await route.fulfill({
  //         status: 404,
  //         contentType: 'text/plain',
  //         body: 'Not Found!'
  //     });
  // });
  // await page.reload();
});

test.describe("API Requests", () => {
  test.describe("Public", () => {
    test("Get brands [/api/cars/brands]", async ({ request }) => {
      const response = await request.get("/api/cars/brands");
      const body = await response.json();

      console.log(`Response ${JSON.stringify(response)}`);
      console.log("-------------------------");
      console.log(`Body ${JSON.stringify(body)}`);
      console.log("-------------------------");
      console.log(`Status ${response.status()}`);

      expect(response.status()).toBe(200);
      expect(body.data[0].title).toBe("Audi");
      expect(body.data.length).toBe(5);
    });
  });

  test.describe("Private", () => {
    let sid: string;
    let carIdForRemoving: string;

    test.beforeAll(async ({ request }) => {
      const authRequest = await request.post("/api/auth/signin", {
        data: {
          email: usersList.mainUser.email,
          password: usersList.mainUser.password,
          remember: false,
        },
      });
      sid = authRequest.headers()["set-cookie"].split(";")[0];
      expect(sid).not.toBeUndefined();

      const carToAdd = {
        carBrandId: 2,
        carModelId: 9,
        mileage: 9999,
      };

      const createCarForRemoving = await request.post("/api/cars/", {
        data: carToAdd,
        headers: {
          Cookie: sid,
        },
      });
      const body = await createCarForRemoving.json();
      carIdForRemoving = body.data.id;
      expect(carIdForRemoving).not.toBeUndefined();
    });

    test("Get cars [/api/cars/]", async ({ request }) => {
      const response = await request.get("/api/cars/", {
        headers: {
          Cookie: sid,
        },
      });
      expect(response.status()).toBe(200);
    });

    test("Add new car BMW X6 [/api/cars/]", async ({ request }) => {
      const carToAdd = {
        carBrandId: 2,
        carModelId: 9,
        mileage: 9999,
      };
      const response = await request.post("/api/cars/", {
        data: carToAdd,
        headers: {
          Cookie: sid,
        },
      });
      const body = await response.json();
      console.log(body);
      expect(response.status()).toBe(201);
      expect(body.data.carBrandId).toBe(carToAdd.carBrandId);
      expect(body.data.carModelId).toBe(carToAdd.carModelId);
      expect(body.data.mileage).toBe(carToAdd.mileage);
      expect(body.data.initialMileage).toBe(carToAdd.mileage);
      expect(body.data.brand).toBe("BMW");
    });

    test("Delete car [/api/cars/{id}]", async ({ request }) => {
      const response = await request.delete(`/api/cars/${carIdForRemoving}`, {
        headers: {
          Cookie: sid,
        },
      });
      const body = await response.json();
      expect(body.data.carId).toBe(carIdForRemoving);
      expect(response.status()).toBe(200);
    });
  });

  test.describe("Private with controllers", () => {
    let sid: string;
    let carIdForRemoving: string;

    test.beforeAll(async ({ request }) => {
      authController = new AuthController(request);

      sid = await authController.getAuthCookie(
        usersList.mainUser.email,
        usersList.mainUser.password
      );

      const carToAdd = {
        carBrandId: 2,
        carModelId: 9,
        mileage: 9999,
      };

      const createCarForRemoving = await request.post("/api/cars/", {
        data: carToAdd,
        headers: {
          Cookie: sid,
        },
      });
      const body = await createCarForRemoving.json();
      carIdForRemoving = body.data.id;
      expect(carIdForRemoving).not.toBeUndefined();
    });

    test("Get cars [/api/cars/]", async ({ request }) => {
      const response = await request.get("/api/cars/", {
        headers: {
          Cookie: sid,
        },
      });
      expect(response.status()).toBe(200);
    });

    test("Add new car BMW X6 [/api/cars/]", async ({ request }) => {
      const carToAdd = {
        carBrandId: 2,
        carModelId: 9,
        mileage: 9999,
      };
      const response = await request.post("/api/cars/", {
        data: carToAdd,
        headers: {
          Cookie: sid,
        },
      });
      const body = await response.json();
      console.log(body);
      expect(response.status()).toBe(201);
      expect(body.data.carBrandId).toBe(carToAdd.carBrandId);
      expect(body.data.carModelId).toBe(carToAdd.carModelId);
      expect(body.data.mileage).toBe(carToAdd.mileage);
      expect(body.data.initialMileage).toBe(carToAdd.mileage);
      expect(body.data.brand).toBe("BMW");
    });

    test("Delete car [/api/cars/{id}]", async ({ request }) => {
      const response = await request.delete(`/api/cars/${carIdForRemoving}`, {
        headers: {
          Cookie: sid,
        },
      });
      const body = await response.json();
      expect(body.data.carId).toBe(carIdForRemoving);
      expect(response.status()).toBe(200);
    });
  });
});
