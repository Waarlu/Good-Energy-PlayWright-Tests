import { Page } from "@playwright/test";

export class BasePage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async next() {
    await this.page.getByRole("button", { name: "Next" }).click();
  }

  async back() {
    await this.page.getByTestId("btnBack").click();
  }

  async acceptCookies() {
    await this.page.locator('button:text("Allow all")').click();
  }

  async rejectCookies() {
    await this.page.locator('button:text("Reject all")').click();
  }

  async textVisible(message: string) {
    await this.page.getByText(message).nth(0).isEnabled();
  }
}
