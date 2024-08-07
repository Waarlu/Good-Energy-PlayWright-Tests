import { expect } from "@playwright/test";
import { OwnRentPage } from "../pages/ownRentPage";
import { HouseBedroomsPage } from "../pages/houseBedroomPage";
import { PropertySizePage } from "../pages/propertySize";
import { EnergySavingMeasuresPage } from "../pages/energySavingMeasuresPage";
import { FuelPage } from "../pages/fuelPage";
import { BoilerTypePage } from "../pages/boilerTypePage";
import { PropertyTypePage } from "../pages/propertyTypePage";
import { TotalFloorAreaPage } from "../pages/totalFloorAreaPage";
import { HouseAgePage } from "../pages/houseAgePage";
import { HeatingSystemPage } from "../pages/heatingSystemPage";
import { PropertyAddressPage } from "../pages/propertyAddress";
import { EmailPage } from "../pages/email";
import { URL } from "../helpers/url";
import { EstimationPage } from "../pages/estimationPage";
import { Headers } from "./headers";

export async function e2e(page, property) {
  await page.goto(URL.heatPump);

  await expect(page).toHaveTitle(/Good Energy Heating/);
  await expect(await page.getByRole("heading", { name: Headers.questionnaire })).toBeVisible();
  const propertyAddress = new PropertyAddressPage(page);
  await propertyAddress.rejectCookies();
  await propertyAddress.insertAddress(property);

  await expect(page).toHaveURL(URL.myEmail);
  await expect(await page.getByRole("heading", { name: Headers.email })).toBeVisible();
  const email = new EmailPage(page);
  await email.insertEmailAddress(property["email address"]);

  await expect(page).toHaveURL(URL.ownRent);
  await expect(await page.getByRole("heading", { name: Headers.ownRent })).toBeVisible();

  const ownRent = new OwnRentPage(page);
  await ownRent.selectOwnership(property["Own/Rent"]);

  await expect(page).not.toHaveURL(URL.ownRent);

  if (page.url().includes(URL.propertyType)) {
    await expect(await page.getByRole("heading", { name: Headers.typeOfProperty })).toBeVisible();
    const propetType = new PropertyTypePage(page);
    await propetType.selectPropetyType(property["House Type"]);
  }
  await expect(page).toHaveURL(URL.houseBedrooms);
  await expect(await page.getByRole("heading", { name: Headers.houseBedrooms })).toBeVisible();

  const houseBedrooms = new HouseBedroomsPage(page);
  await houseBedrooms.selectBedrooms(property.Bedrooms);

  await expect(page).toHaveURL(URL.propertySize);
  await expect(await page.getByRole("heading", { name: Headers.propetySize })).toBeVisible();
  await expect(await page.getByRole("heading", { name: Headers.basement })).toBeVisible();
  const propertySize = new PropertySizePage(page);
  await propertySize.selectPropertySize(property);

  await expect(page).not.toHaveURL(URL.propertySize);
  if (page.url().includes(URL.totalFloorArea)) {
    await expect(await page.getByRole("heading", { name: Headers.floorArea })).toBeVisible();
    const totalFloorArea = new TotalFloorAreaPage(page);
    if (property["House size"] === "") await totalFloorArea.skip();
    else {
      await totalFloorArea.insertTotalFloorArea(property["House size"]);
    }
    await expect(page).not.toHaveURL(URL.totalFloorArea);
  }

  if (page.url().includes(URL.houseAge)) {
    await expect(await page.getByRole("heading", { name: Headers.propertyBuilt })).toBeVisible();
    const houseArea = new HouseAgePage(page);
    await houseArea.selectHouseAge(property["House Age"]);
    await expect(page).not.toHaveURL(URL.houseAge);
  }
  await expect(page).toHaveURL(URL.energySavingMeasures);

  const energySavings = new EnergySavingMeasuresPage(page);
  if (property["TFA"] === "Has EPC") {
    await expect(
      await page.getByRole("heading", { name: `${Headers.esmWithEPC} ${property["EPCYear"]}` })
    ).toBeVisible();
    await energySavings.propertyHasEPCMessage(property["EPCYear"]);
  } else {
    await expect(await page.getByRole("heading", { name: Headers.esm })).toBeVisible();
  }
  await energySavings.selectEnergy(property["Energy Efficiency Measures"]);

  await expect(page).toHaveURL(URL.fuel);
  await expect(await page.getByRole("heading", { name: Headers.fuel })).toBeVisible();

  const fuel = new FuelPage(page);
  await fuel.selectFuel(property["Fuel Source"]);
  await expect(page).not.toHaveURL(URL.fuel);
}

async function obtainEstimation(page, property) {
  await expect(page).toHaveURL(URL.myEstimate, { timeout: 70000 });

  const estimation = new EstimationPage(page);

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
  const totalCost = formatter.format(property["Total cost"]);
  const customerToPay = formatter.format(property["Total cost"] - 7500);

  await expect(await estimation.findTextInEstimationPage(totalCost)).toBeVisible();
  await expect(await estimation.getEstimationElement()).toContainText(`Your estimated cost is ${customerToPay}`);

  const postcode = property.Address.split(", ").at(-1);
  const postcodeArea = postcode.substring(0, 2);

  await expect(await estimation.getEstimationReferenceElement()).toContainText(`Estimate reference: ${postcodeArea}`);

  const extrasIncluded = property["Estimate Includes"].split(",");
  for (const extras of extrasIncluded) {
    await expect(await estimation.findTextInEstimationPage(extras)).toBeVisible();
  }
}

export async function requestEstimation(page, property) {
  await e2e(page, property);
  if (page.url().includes(URL.boilerType)) {
    await expect(await page.getByRole("heading", { name: Headers.boilerType })).toBeVisible();
    const boiler = new BoilerTypePage(page);
    await boiler.selectDoYouHaveAWaterCylinder(property["Hot Water Cylinder"]);
    await expect(page).not.toHaveURL(URL.boilerType, { timeout: 70000 });
  } else if (page.url().includes(URL.heatingSystem)) {
    await expect(await page.getByRole("heading", { name: Headers.heatingSystem })).toBeVisible();
    const heatingSystem = new HeatingSystemPage(page);
    heatingSystem.selectHeatingSystem(property["Heating System"]);
    await expect(page).not.toHaveURL(URL.heatingSystem, { timeout: 70000 });
  }
  await obtainEstimation(page, property);
}
