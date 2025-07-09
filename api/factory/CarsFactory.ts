export class CarsFactory {
  static createCar(brand: number, model: number, mileage: number) {
    return {
      carBrandId: brand,
      carModelId: model,
      mileage,
    };
  }
}
