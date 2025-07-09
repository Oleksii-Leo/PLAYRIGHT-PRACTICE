export class UsersFactory {
  static createUser(
    name: string,
    lastName: string,
    email: string,
    password: string,
    repeatPassword: string
  ) {
    return {
      name,
      lastName,
      email,
      password,
      repeatPassword,
    };
  }
}
