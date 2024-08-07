import { Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class OwnRentPage extends BasePage {
  async selectOwn() {
    await this.page.getByTestId("btnown").click();
  }

  async selectRent() {
    await this.page.getByTestId("btnrent").click();
  }

  async selectedOwnership(ownership: string): Promise<Locator> {
    return await this.page.locator(
      `img[src="/assets/images/Icon=${ownership.toLowerCase()}_active, Variant=Filled.svg"]`
    );
  }

  async selectOwnership(ownership: string) {
    if (ownership === "Own") {
      await this.selectOwn();
      await this.next();
    } else await this.selectRent();
  }
}
