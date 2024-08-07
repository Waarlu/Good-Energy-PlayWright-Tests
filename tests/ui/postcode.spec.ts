import { test, expect } from "@playwright/test";

import { PropertyAddressPage } from "../../pages/propertyAddress";
import * as csv from "fast-csv";
import { URL } from "../../helpers/url";

let properties;

test.beforeAll(async () => {
  const myObject = new Promise((resolve) => {
    const dataArray: JSON[] = [];
    csv
      .parseFile("data/postcode.csv", { headers: true })
      .on("data", (data) => {
        dataArray.push(data);
      })
      .on("end", () => {
        resolve(dataArray);
      });
  });
  properties = await myObject;

  if (properties.length !== 16) {
    console.error(`The length of the csv has changed, there is no 16 items but ${properties.length}`);
  }
});

async function requestEstimation(page, property) {
  await page.goto(URL.heatPump);

  await expect(page).toHaveTitle(/Good Energy Heating/);
  const propertyAddress = new PropertyAddressPage(page);

  await propertyAddress.rejectCookies();

  await propertyAddress.enterAddress(property.Postcode);

  await propertyAddress.addressVisible(property["Found Address"]);
}

test(`E2E scenarios for house BS12NB`, async ({ page }) => {
  await requestEstimation(page, properties[0]);
});

test(`E2E scenarios for house BS140DE`, async ({ page }) => {
  await requestEstimation(page, properties[1]);
});

test(`E2E scenarios for house bs308el`, async ({ page }) => {
  await requestEstimation(page, properties[2]);
});

test(`E2E scenarios for house bs30 8el`, async ({ page }) => {
  await requestEstimation(page, properties[3]);
});

test(`E2E scenarios for house EC1A 1BB`, async ({ page }) => {
  await requestEstimation(page, properties[4]);
});

test(`E2E scenarios for house ec1a1bb`, async ({ page }) => {
  await requestEstimation(page, properties[5]);
});

test(`E2E scenarios for house IM1 2RF`, async ({ page }) => {
  await requestEstimation(page, properties[6]);
});

test(`E2E scenarios for house BF1 1AD`, async ({ page }) => {
  await requestEstimation(page, properties[7]);
});

test(`E2E scenarios for house CF14 3AT`, async ({ page }) => {
  await requestEstimation(page, properties[8]);
});

test(`E2E scenarios for house CF99 1NA`, async ({ page }) => {
  await requestEstimation(page, properties[9]);
});

test(`E2E scenarios for house SW1A 0AA`, async ({ page }) => {
  await requestEstimation(page, properties[10]);
});

test(`E2E scenarios for house EH99 1SP`, async ({ page }) => {
  await requestEstimation(page, properties[11]);
});

test(`E2E scenarios for house HD7 5UZ`, async ({ page }) => {
  await requestEstimation(page, properties[12]);
});

test(`E2E scenarios for house W2 1jb`, async ({ page }) => {
  await requestEstimation(page, properties[13]);
});

test(`E2E scenarios for house 24 LAIRG`, async ({ page }) => {
  await requestEstimation(page, properties[14]);
});

test(`E2E scenarios for house GY1 3EW`, async ({ page }) => {
  await requestEstimation(page, properties[15]);
});
