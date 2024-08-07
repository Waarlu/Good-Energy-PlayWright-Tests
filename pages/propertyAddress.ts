import { BasePage } from "./basePage";

export class PropertyAddressPage extends BasePage {
  async enterAddress(address: string) {
    await this.page.getByTestId("autoCompleteInput").fill(address);
  }

  async addressVisible(fullAddress: string) {
    await this.textVisible(fullAddress);
  }

  async selectFullAddress(fullAddress: string) {
    await this.page.getByText(fullAddress, { exact: false }).nth(0).click();
  }

  async notInstallingInAreaMessage() {
    await this.textVisible("We are not installing in your area...yet");
  }

  async insertAddress(property) {
    await this.enterAddress(property["Address"]);
    await this.selectFullAddress(property["Full Address"]);
    await this.next();
  }
}
