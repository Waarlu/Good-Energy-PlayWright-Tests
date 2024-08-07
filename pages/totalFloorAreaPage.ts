import { Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class TotalFloorAreaPage extends BasePage {
  async insertTotalFloorArea(floorArea: string) {
    await this.page.getByTestId("inputFloorArea").fill(floorArea);
    await this.next();
  }

  async insertedFloorArea(): Promise<Locator> {
    return await this.page.getByTestId("inputFloorArea");
  }

  async skip() {
    await this.page.getByRole("button", { name: "Skip" }).click();
  }
}
