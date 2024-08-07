import { BasePage } from "./basePage";

export class PropertyTypePage extends BasePage {
  async selectPropetyType(propetyType: string) {
    const typeHouse = {
      Detached: "detached_house",
      "Semi Detached": "semi_detached_house",
      "End of terrace": "end_terrace_house",
      "Mid terrace": "mid_terrace_house",
      "Small Flat": "flat",
      Bungalow: "bungalow",
    }[propetyType];

    if (typeHouse === undefined) {
      throw new Error(`Incorrect property type provided ${propetyType}`);
    }
    await this.page.getByTestId(`btn${typeHouse}`).click();
    await this.next();
  }

  async selectedPropetyType(propetyType: string) {
    const typeHouse = {
      Detached: "detached_house",
      "Semi Detached": "semi_detached_house",
      "End of terrace": "end_terrace_house",
      "Mid terrace": "mid_terrace_house",
      Bungalow: "bungalow",
    }[propetyType];

    if (typeHouse === undefined) {
      throw new Error(`Incorrect property type provided ${propetyType}`);
    }
    return await this.page.locator(
      `img[src="/assets/images/Icon=${typeHouse.toLowerCase()}_active, Variant=Filled.svg"]`
    );
  }
}
