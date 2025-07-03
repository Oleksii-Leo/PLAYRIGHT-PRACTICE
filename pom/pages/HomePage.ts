import { Locator } from "@playwright/test";
import BasePage from "../BasePage";

export default class HomePage extends BasePage {
  private readonly signInButton: Locator = this.page.locator(
    '//button[contains(@class,"header_signin")]'
  );

  async open(): Promise<void> {
    await this.page.goto("");
  }

  async clickSignInButton(): Promise<void> {
    await this.signInButton.click();
  }
}
