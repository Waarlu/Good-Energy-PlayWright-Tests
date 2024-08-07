import { test, expect } from "@playwright/test";
import * as csv from "fast-csv";
import { e2e } from "../../helpers/e2eSteps";
import { URL } from "../../helpers/url";
import { FuelPage } from "../../pages/fuelPage";
import { BasePage } from "../../pages/basePage";
import { EnergySavingMeasuresPage } from "../../pages/energySavingMeasuresPage";
import { PropertySizePage } from "../../pages/propertySize";
import { HouseBedroomsPage } from "../../pages/houseBedroomPage";
import { OwnRentPage } from "../../pages/ownRentPage";
import { EmailPage } from "../../pages/email";
import { HouseAgePage } from "../../pages/houseAgePage";
import { TotalFloorAreaPage } from "../../pages/totalFloorAreaPage";
import { PropertyTypePage } from "../../pages/propertyTypePage";

let properties;

test.beforeAll(async () => {
  const myObject = new Promise((resolve) => {
    const dataArray: JSON[] = [];
    csv
      .parseFile("data/Product catalogue.csv", { headers: true })
      .on("data", (data) => {
        dataArray.push(data);
      })
      .on("end", () => {
        resolve(dataArray);
      });
  });
  properties = await myObject;
});

test(`Verify back functionality for property with EPC`, async ({ page }) => {
  await e2e(page, properties[0]);
  const base = new BasePage(page);
  await base.back();

  await expect(page).toHaveURL(URL.fuel);
  const fuelPage = new FuelPage(page);
  await expect(await fuelPage.selectedFuel(properties[0]["Fuel Source"])).toBeVisible();
  await base.back();

  await expect(page).toHaveURL(URL.energySavingMeasures);
  const energySavings = new EnergySavingMeasuresPage(page);
  await energySavings.back();

  await expect(page).toHaveURL(URL.propertySize);
  const propertySize = new PropertySizePage(page);
  await expect(await propertySize.selectedStoreys(properties[0]["Storeys"])).toBeVisible();
  await expect(await propertySize.selectedBasement(properties[0]["Basement"])).toBeVisible();
  await propertySize.back();

  await expect(page).toHaveURL(URL.houseBedrooms);
  const houseBedrooms = new HouseBedroomsPage(page);
  await houseBedrooms.back();

  await expect(page).toHaveURL(URL.ownRent);
  const ownRent = new OwnRentPage(page);
  await expect(await ownRent.selectedOwnership(properties[0]["Own/Rent"])).toBeVisible();
  await ownRent.back();

  await expect(page).toHaveURL(URL.myEmail);
  const email = new EmailPage(page);
  if (properties[0]["email address"] !== "") {
    //await expect(await email.insertedEmail()).toHaveValue(properties[0]["email address"]);
  }
  await email.back();

  for (const partialAddress of properties[0]["Address"].split(", ")) {
    await expect(page.locator(`//*[text()='${partialAddress}']`)).toBeVisible();
  }
});

test(`Verify back functionality for property with no EPC`, async ({ page }) => {
  await e2e(page, properties[2]);
  const base = new BasePage(page);
  await base.back();

  await expect(page).toHaveURL(URL.fuel);
  const fuelPage = new FuelPage(page);
  await expect(await fuelPage.selectedFuel(properties[2]["Fuel Source"])).toBeVisible();
  await base.back();

  await expect(page).toHaveURL(URL.energySavingMeasures);
  const energySavings = new EnergySavingMeasuresPage(page);
  await energySavings.back();

  await expect(page).toHaveURL(URL.houseAge);
  const houseAge = new HouseAgePage(page);
  await expect(await houseAge.selectedHouseAge()).toHaveText(properties[2]["House Age"]);
  await houseAge.back();

  await expect(page).toHaveURL(URL.totalFloorArea);
  const totalFloorArea = new TotalFloorAreaPage(page);
  await expect(await totalFloorArea.insertedFloorArea()).toHaveValue(properties[2]["House size"]);
  await totalFloorArea.back();

  await expect(page).toHaveURL(URL.propertySize);
  const propertySize = new PropertySizePage(page);
  await expect(await propertySize.selectedStoreys(properties[2]["Storeys"])).toBeVisible();
  await expect(await propertySize.selectedBasement(properties[2]["Basement"])).toBeVisible();
  await propertySize.back();

  await expect(page).toHaveURL(URL.houseBedrooms);
  const houseBedrooms = new HouseBedroomsPage(page);
  await houseBedrooms.back();

  await expect(page).toHaveURL(URL.propertyType);
  const propertyType = new PropertyTypePage(page);
  await expect(await propertyType.selectedPropetyType(properties[2]["House Type"])).toBeVisible();
  await propertyType.back();

  await expect(page).toHaveURL(URL.ownRent);
  const ownRent = new OwnRentPage(page);
  await expect(await ownRent.selectedOwnership(properties[2]["Own/Rent"])).toBeVisible();
  await ownRent.back();

  await expect(page).toHaveURL(URL.myEmail);
  const email = new EmailPage(page);
  if (properties[0]["email address"] !== "") {
    // await expect(await email.insertedEmail()).toHaveValue(properties[2]["email address"]);
  }
  await email.back();
  for (const partialAddress of properties[2]["Address"].split(", ")) {
    await expect(page.locator(`//*[text()='${partialAddress}']`)).toBeVisible();
  }
  await email.next();
  if (properties[0]["email address"] !== "") {
    //await expect(await email.insertedEmail()).toHaveValue(properties[2]["email address"]);
  }
  await email.next();
  await expect(await ownRent.selectedOwnership(properties[2]["Own/Rent"])).toBeVisible();
  await ownRent.next();

  await expect(await propertyType.selectedPropetyType(properties[2]["House Type"])).toBeVisible();
  await propertyType.next();
  await houseBedrooms.next();

  await expect(await propertySize.selectedStoreys(properties[2]["Storeys"])).toBeVisible();
  await expect(await propertySize.selectedBasement(properties[2]["Basement"])).toBeVisible();
  await propertySize.next();
  await expect(await totalFloorArea.insertedFloorArea()).toHaveValue(properties[2]["House size"]);
  await totalFloorArea.next();

  await expect(await houseAge.selectedHouseAge()).toHaveText(properties[2]["House Age"]);
  await houseAge.next();
  await energySavings.next();

  await expect(await fuelPage.selectedFuel(properties[2]["Fuel Source"])).toBeVisible();
  await base.next();
});
