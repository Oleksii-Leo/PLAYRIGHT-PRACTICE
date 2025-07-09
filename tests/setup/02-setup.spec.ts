import test, { expect } from "@playwright/test";
import UsersController from "../../api/controllers/UsersController";
import { UsersFactory } from "../../api/factory/UsersFactory";
import { usersList } from "../../test-data/users";

test.describe("Create users", () => {
  let usersController: UsersController;

  test.beforeEach(({ request }) => {
    usersController = new UsersController(request);
  });
  test("Create Main User", async () => {
    const user = UsersFactory.createUser(
      usersList.mainUser.name,
      usersList.mainUser.lastName,
      usersList.mainUser.email,
      usersList.mainUser.password,
      usersList.mainUser.password
    );
    const { name, lastName, email, password, repeatPassword } = user;

    const response = await usersController.registerUser(
      name,
      lastName,
      email,
      password,
      repeatPassword
    );
    expect(response.status()).toBe(201);
  });
});
