import { BasePage } from "./basePage";
import { Locator } from "@playwright/test";

export class FuelPage extends BasePage {
  async selectFuel(fuelType: string) {
    const fuelTypeId = {
      "Mains Gas": "mains_gas",
      LPG: "lpg",
      Oil: "heating_oil",
      Electricity: "electricity",
      Other: "other",
    }[fuelType];

    if (fuelTypeId === undefined) {
      throw new Error(`Incorrect fuel type provided ${fuelType}`);
    }

    await this.page.getByTestId(`btn${fuelTypeId}`).click();
    await this.next();
  }

  async selectedFuel(fuelType: string): Promise<Locator> {
    const fuelTypeId = {
      "Mains Gas": "mains_gas",
      LPG: "lpg",
      Oil: "heating_oil",
      Electricity: "electricity",
      Other: "other",
    }[fuelType];

    if (fuelTypeId === undefined) {
      throw new Error(`Incorrect fuel type provided ${fuelType}`);
    }

    return await this.page.locator(`img[src="/assets/images/Icon=${fuelTypeId}_active, Variant=Filled.svg"]`);
  }
}
