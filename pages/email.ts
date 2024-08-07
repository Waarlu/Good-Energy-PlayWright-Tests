import { Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class EmailPage extends BasePage {
  async insertEmailAddress(email: string) {
    if (email !== undefined && email !== "") {
      await this.page.locator("#emailAddress").fill(email);
    }
    await this.next();
  }

  async insertedEmail(): Promise<Locator> {
    return await this.page.locator("#emailAddress");
  }
}
