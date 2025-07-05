import {
  test,
  expect,
  request as baseRequest,
  APIRequestContext,
} from "@playwright/test";
import AuthController from "../api/controllers/AuthController";
import { usersList } from "../test-data/users";

test.describe("Create car via API", () => {
  let sid: string;
  let requestContext: APIRequestContext;

  test.beforeAll(async () => {
    // Створюємо новий API-контекст
    requestContext = await baseRequest.newContext();

    const authController = new AuthController(requestContext);
    sid = await authController.getAuthCookie(
      usersList.mainUser.email,
      usersList.mainUser.password
    );
  });

  test.afterAll(async () => {
    await requestContext.dispose(); // Закриваємо контекст
  });

  test("Positive: Create a car successfully", async () => {
    const carData = {
      carBrandId: 1,
      carModelId: 1,
      mileage: 123,
    };

    const response = await requestContext.post("/api/cars", {
      data: carData,
      headers: {
        Cookie: sid,
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.data.carBrandId).toBe(carData.carBrandId);
    expect(body.data.carModelId).toBe(carData.carModelId);
    expect(body.data.mileage).toBe(carData.mileage);
  });

  test("Negative: Missing required field", async () => {
    const response = await requestContext.post("/api/cars", {
      data: {
        carBrandId: 1,
        mileage: 100,
      },
      headers: {
        Cookie: sid,
      },
    });

    expect(response.status()).toBe(400);
  });

  test("Negative: Invalid mileage (string instead of number)", async () => {
    const response = await requestContext.post("/api/cars", {
      data: {
        carBrandId: 1,
        carModelId: 1,
        mileage: "invalid",
      },
      headers: {
        Cookie: sid,
      },
    });

    expect(response.status()).toBe(400);
  });
});
