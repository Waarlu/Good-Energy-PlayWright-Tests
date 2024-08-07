import { Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class HouseAgePage extends BasePage {
  async selectHouseAge(houseAge: string) {
    await this.page.getByTestId("select").click();
    await this.page.getByText(houseAge).click();
    await this.next();
  }

  async selectedHouseAge(): Promise<Locator> {
    return await this.page.getByTestId("select");
  }
}
