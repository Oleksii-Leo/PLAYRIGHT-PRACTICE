import { Locator, Page, expect } from "@playwright/test";

export default class RegistrationPage {
  private readonly page: Page;

  private readonly registrationButton: Locator;
  private readonly nameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly repeatPasswordInput: Locator;
  private readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registrationButton = page.getByRole("button", {
      name: "Registration",
    });
    this.nameInput = page.locator("#signupName");
    this.lastNameInput = page.locator("#signupLastName");
    this.emailInput = page.locator("#signupEmail");
    this.passwordInput = page.locator("#signupPassword");
    this.repeatPasswordInput = page.locator("#signupRepeatPassword");
    this.registerButton = page.getByRole("button", { name: "Register" });
  }

  async openRegistrationForm() {
    await this.registrationButton.click();
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillRepeatPassword(password: string) {
    await this.repeatPasswordInput.fill(password);
  }

  async submit() {
    await this.registerButton.click();
  }

  async expectErrorVisible(text: string) {
    await expect(this.page.getByText(text, { exact: true })).toBeVisible();
  }

  async expectRegisterDisabled() {
    await expect(this.registerButton).toBeDisabled();
  }

  async expectAddCarVisible() {
    await expect(this.page.getByText("Add car")).toBeVisible();
  }
}
