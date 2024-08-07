import { BasePage } from "./basePage";

export class HouseBedroomsPage extends BasePage {
  async selectBedrooms(amountOfRooms: string) {
    const rooms = {
      "1": "one",
      "2": "two",
      "3": "three",
      "4": "four",
      "5": "fiveplus",
    }[amountOfRooms];

    if (rooms === undefined) {
      throw new Error(`Incorrect amount of rooms provided ${amountOfRooms}`);
    }

    await this.page.getByTestId(`btn${rooms}_bedroom`).click();
    await this.next();
  }
}
