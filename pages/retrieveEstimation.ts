import { Page } from "@playwright/test";

export class RetrieveEstimationPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async enterAddress(address: string, fullAddress: string) {
    await this.page.getByTestId("autoCompleteInput").fill(address);
    await this.page.getByText(fullAddress, { exact: false }).nth(0).click();
  }

  async continue() {
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  async acceptCookies() {
    await this.page.locator('button:text("Allow all")').click();
  }

  async rejectCookies() {
    await this.page.locator('button:text("Reject all")').click();
  }
}
