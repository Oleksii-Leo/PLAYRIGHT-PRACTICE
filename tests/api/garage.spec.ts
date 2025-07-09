import test, { expect } from "@playwright/test";
import { usersList } from "../../test-data/users";
import AuthController from "../../api/controllers/AuthController";
import CarsController from "../../api/controllers/CarsContoller";
import { CarsFactory } from "../../api/factory/CarsFactory";

let authController: AuthController;
let carsController: CarsController;

test.describe("API Requests", () => {
  test.beforeEach(async ({ request }) => {
    authController = new AuthController(request);
    carsController = new CarsController(request);
  });

  test.describe("Public", () => {
    test("Get brands [/api/cars/brands]", async () => {
      const response = await carsController.getBrands();
      const body = await response.json();
      expect(response.status()).toBe(200);
      expect(body.data.length).toBe(5);
    });
  });
  test.describe("Private with controllers", () => {
    let sid: string;
    let carIdForRemoving: number;
    let carsControllerInner: CarsController;

    test.beforeAll(async ({ request }) => {
      authController = new AuthController(request);
      carsControllerInner = new CarsController(request);

      sid = await authController.getAuthCookie(
        usersList.mainUser.email,
        usersList.mainUser.password
      );

      const carToAdd = CarsFactory.createCar(2, 9, 9999);
      const createCarForRemoving = await carsControllerInner.addCar(
        carToAdd,
        sid
      );
      const body = await createCarForRemoving.json();

      carIdForRemoving = body.data.id;
      expect(carIdForRemoving).not.toBeUndefined();
    });

    test("Get cars [/api/cars/]", async () => {
      const response = await carsController.getUserCars(sid);
      expect(response.status()).toBe(200);
    });

    test("Add new car BMW X6 [/api/cars/]", async ({ request }) => {
      const carToAdd = CarsFactory.createCar(2, 9, 9999);
      const response = await carsController.addCar(carToAdd, sid);
      const body = await response.json();

      expect(response.status()).toBe(201);
      expect(body.data.carBrandId).toBe(carToAdd.carBrandId);
      expect(body.data.carModelId).toBe(carToAdd.carModelId);
      expect(body.data.mileage).toBe(carToAdd.mileage);
      expect(body.data.initialMileage).toBe(carToAdd.mileage);
      expect(body.data.brand).toBe("BMW");
    });

    test("Delete car [/api/cars/{id}]", async ({ request }) => {
      const response = await carsController.deleteCar(carIdForRemoving, sid);
      const body = await response.json();
      expect(body.data.carId).toBe(carIdForRemoving);
      expect(response.status()).toBe(200);
    });
  });
});
