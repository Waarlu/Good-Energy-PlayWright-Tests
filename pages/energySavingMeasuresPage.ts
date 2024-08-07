import { BasePage } from "./basePage";

export class EnergySavingMeasuresPage extends BasePage {
  async propertyHasEPCMessage(EPCYear: string) {
    await this.textVisible(`The property has an Energy Performance Certificate (EPC) from ${EPCYear}`);
  }

  async selectEnergy(energySavings: string) {
    if (energySavings.includes("None")) {
      await this.page.getByText("None of these apply to me").click();
    }
    if (energySavings.includes("Loft")) {
      await this.page.getByText("Loft insulation").click();
    }
    if (energySavings.includes("Wall")) {
      await this.page.getByText("Wall insulation").click();
    }
    if (energySavings.includes("Double Glazing")) {
      await this.page.getByText("Double or triple glazing").click();
    }

    await this.next();
  }
}
