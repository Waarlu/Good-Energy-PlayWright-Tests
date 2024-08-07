import { test, expect } from "@playwright/test";
import * as csv from "fast-csv";
import { URL } from "../../helpers/url";
import { Headers } from "../../helpers/headers";
import { PropertyAddressPage } from "../../pages/propertyAddress";
import { OwnRentPage } from "../../pages/ownRentPage";
import { PropertyTypePage } from "../../pages/propertyTypePage";
import { HouseBedroomsPage } from "../../pages/houseBedroomPage";
import { TotalFloorAreaPage } from "../../pages/totalFloorAreaPage";

import modals from "../../helpers/modals.json";
import { PropertySizePage } from "../../pages/propertySize";
import { HouseAgePage } from "../../pages/houseAgePage";
import { EnergySavingMeasuresPage } from "../../pages/energySavingMeasuresPage";
import { FuelPage } from "../../pages/fuelPage";
import { HeatingSystemPage } from "../../pages/heatingSystemPage";

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

async function verifyModal(page, modalContent) {
  await (await page.getByText(modalContent.modal)).click();
  await expect(page.getByRole("heading", { name: modalContent.title })).toBeVisible();
  for (const paragraph of modalContent.text) {
    await expect(await page.getByText(paragraph)).toBeVisible();
  }
  await (await page.getByText("Close")).click();
}
test(`Verify modals in the different pages`, async ({ page }) => {
  const property = properties[2];

  await page.goto(URL.heatPump);

  await expect(page).toHaveTitle(/Good Energy Heating/);
  await expect(page.getByRole("heading", { name: Headers.questionnaire })).toBeVisible();
  const propertyAddress = new PropertyAddressPage(page);
  await propertyAddress.rejectCookies();

  await verifyModal(page, modals.landingPage);

  await propertyAddress.insertAddress(property);
  await expect(page).toHaveURL(URL.myEmail);
  await propertyAddress.next();
  await expect(page).toHaveURL(URL.ownRent);
  const ownRent = new OwnRentPage(page);
  await ownRent.selectOwnership(property["Own/Rent"]);
  await expect(await page.getByRole("heading", { name: Headers.typeOfProperty })).toBeVisible();
  const propetType = new PropertyTypePage(page);
  await propetType.selectPropetyType(property["House Type"]);
  await expect(page).toHaveURL(URL.houseBedrooms);
  const houseBedrooms = new HouseBedroomsPage(page);
  await houseBedrooms.selectBedrooms(property.Bedrooms);
  await expect(page).toHaveURL(URL.propertySize);
  const propertySize = new PropertySizePage(page);
  await propertySize.selectPropertySize(property);
  await expect(await page.getByRole("heading", { name: Headers.floorArea })).toBeVisible();
  const totalFloorArea = new TotalFloorAreaPage(page);

  await verifyModal(page, modals.floorArea);

  await totalFloorArea.skip();
  await expect(await page.getByRole("heading", { name: Headers.propertyBuilt })).toBeVisible();
  const houseArea = new HouseAgePage(page);

  await verifyModal(page, modals.houseAge);

  await houseArea.selectHouseAge(property["House Age"]);
  const energySavings = new EnergySavingMeasuresPage(page);
  await energySavings.selectEnergy(property["Energy Efficiency Measures"]);
  await expect(page).toHaveURL(URL.fuel);
  const fuel = new FuelPage(page);
  await fuel.selectFuel("Mains Gas");

  await verifyModal(page, modals.boilerType);

  await fuel.back();
  await fuel.selectFuel("Electricity");
  const heatingSystem = new HeatingSystemPage(page);

  await verifyModal(page, modals.heatingSystem);

  await heatingSystem.selectHeatingSystem("Heat pump");
  await expect(page).not.toHaveURL(URL.heatingSystem, { timeout: 70000 });

  await verifyModal(page, modals.boilerUpgradeSchema);
  await verifyModal(page, modals.moreAboutCarbonSavings);
});
