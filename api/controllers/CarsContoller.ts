import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { carToAddRequest } from "../interfaces/car.interface";

export default class CarsController {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getBrands(): Promise<APIResponse> {
    return await this.request.get("/api/cars/brands");
  }

  async getUserCars(sid: string): Promise<APIResponse> {
    return await this.request.get("/api/cars/", {
      headers: {
        Cookie: sid,
      },
    });
  }

  async addCar(car: carToAddRequest, sid: string): Promise<APIResponse> {
    return await this.request.post("/api/cars/", {
      data: car,
      headers: {
        Cookie: sid,
      },
    });
  }

  async deleteCar(carId: number, sid: string): Promise<APIResponse> {
    return await this.request.delete(`/api/cars/${carId}`, {
      headers: {
        Cookie: sid,
      },
    });
  }
}
