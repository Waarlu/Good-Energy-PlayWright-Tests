import { Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class PropertySizePage extends BasePage {
  async selectStoreys(amountOfStoreys: number) {
    await this.page.getByTestId(`btn${amountOfStoreys}`).click();
  }

  async selectedStoreys(amountOfStoreys: number): Promise<Locator> {
    return this.page.locator(`img[src="/assets/images/Icon=${amountOfStoreys}_storeys_active, Variant=Filled.svg"]`);
  }

  async selectBasement(basement: string) {
    if (basement === "Yes") await this.page.getByTestId("btnbasement").click();
    else await this.page.getByTestId("btnno_basement").click();
  }

  async selectedBasement(basement: string): Promise<Locator> {
    const id = basement === "Yes" ? "basement" : "no_basement";

    return await this.page.locator(`img[src="/assets/images/Icon=${id}_active, Variant=Filled.svg"]`);
  }

  async selectPropertySize(property) {
    await this.selectStoreys(property.Storeys);
    await this.selectBasement(property.Basement);
    await this.next();
  }
}
