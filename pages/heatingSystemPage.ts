import { BasePage } from "./basePage";

export class HeatingSystemPage extends BasePage {
  async selectHeatingSystem(heatingSystem: string) {
    await this.page.getByTitle(heatingSystem).nth(0).click();
    await this.next();
  }
}
