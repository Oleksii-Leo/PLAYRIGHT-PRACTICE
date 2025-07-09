import { APIRequestContext, APIResponse, expect } from "@playwright/test";

export default class UsersController {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async registerUser(
    name: string,
    lastName: string,
    email: string,
    password: string,
    repeatPassword: string
  ) {
    return await this.request.post("/api/auth/signup", {
      data: {
        name,
        lastName,
        email,
        password,
        repeatPassword,
      },
    });
  }

  async deleteUser(sid: string) {
    return await this.request.delete("/api/users", {
      headers: {
        Cookie: sid,
      },
    });
  }
}
