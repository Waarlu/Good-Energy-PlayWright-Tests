import { BasePage } from "./basePage";

export class BoilerTypePage extends BasePage {
  async selectDoYouHaveAWaterCylinder(waterCylinder: string) {
    if (waterCylinder === "Yes") await this.page.getByTitle("Yes").nth(0).click();
    else await this.page.getByTitle("No").nth(0).click();
    await this.next();
  }
}
