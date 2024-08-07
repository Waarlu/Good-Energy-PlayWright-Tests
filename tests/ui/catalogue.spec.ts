import { test, expect } from "@playwright/test";
import { PropertyAddressPage } from "../../pages/propertyAddress";
import * as csv from "fast-csv";
import { URL } from "../../helpers/url";
import { e2e, requestEstimation } from "../../helpers/e2eSteps";
import { EmailPage } from "../../pages/email";
import { OwnRentPage } from "../../pages/ownRentPage";
import { Headers } from "../../helpers/headers";
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

test(`E2E scenarios for house CB22 5BN`, async ({ page }) => {
  await requestEstimation(page, properties[0]);
});

test(`E2E scenarios for house RG31 6JY`, async ({ page }) => {
  await requestEstimation(page, properties[1]);
});

test(`E2E scenarios for house AL6 0HZ - No EPC`, async ({ page }) => {
  await requestEstimation(page, properties[2]);
});

test.skip(`E2E scenarios for house AL6 0HZ - With EPC`, async ({ page }) => {
  await requestEstimation(page, properties[19]);
});

test(`E2E scenarios for house MK14 6DD`, async ({ page }) => {
  await requestEstimation(page, properties[3]);
});

test(`E2E scenarios for house BS8 3LB`, async ({ page }) => {
  await requestEstimation(page, properties[4]);
});

test(`E2E scenarios for house BS41 9LN`, async ({ page }) => {
  await requestEstimation(page, properties[5]);
});

test(`E2E scenarios for house BS41 9LN - Heat pump`, async ({ page }) => {
  await requestEstimation(page, properties[6]);
});

test(`E2E scenarios for house BS15 4JH`, async ({ page }) => {
  await requestEstimation(page, properties[7]);
});

test(`E2E scenarios for house BS2 0JB`, async ({ page }) => {
  await page.goto(URL.heatPump);

  await expect(page).toHaveTitle(/Good Energy Heating/);
  const propertyAddress = new PropertyAddressPage(page);
  await propertyAddress.rejectCookies();
  await propertyAddress.insertAddress(properties[8]);

  await expect(page).toHaveURL(URL.myEmail);

  const email = new EmailPage(page);
  await email.insertEmailAddress(properties[8]["email address"]);

  await expect(page).toHaveURL(URL.ownRent);

  const ownRent = new OwnRentPage(page);
  await ownRent.selectOwnership(properties[8]["Own/Rent"]);

  await expect(page).not.toHaveURL(URL.ownRent);

  await expect(page).toHaveURL(URL.contactUs);
  await expect(await page.getByRole("heading", { name: Headers.contactUs })).toBeVisible();
});

test(`E2E scenarios for house BS2 0JB Small Flat`, async ({ page }) => {
  await page.goto(URL.heatPump);

  await expect(page).toHaveTitle(/Good Energy Heating/);
  const propertyAddress = new PropertyAddressPage(page);
  await propertyAddress.rejectCookies();
  await propertyAddress.insertAddress(properties[9]);

  await expect(page).toHaveURL(URL.myEmail);

  const email = new EmailPage(page);

  await email.next();

  await expect(page).toHaveURL(URL.ownRent);

  const ownRent = new OwnRentPage(page);
  await ownRent.selectOwnership(properties[9]["Own/Rent"]);

  await expect(page).not.toHaveURL(URL.ownRent);
  if (page.url().includes(URL.propertyType)) {
    await expect(await page.getByRole("heading", { name: Headers.typeOfProperty })).toBeVisible();
    const propetType = new PropertyTypePage(page);
    await propetType.selectPropetyType(properties[9]["House Type"]);
  }
  await expect(page).toHaveURL(URL.cantHelp);
  await expect(await page.getByText(Headers.cantInstall)).toBeVisible();
});

test(`E2E scenarios for house SW1W 9ST`, async ({ page }) => {
  await page.goto(URL.heatPump);

  await expect(page).toHaveTitle(/Good Energy Heating/);
  const propertyAddress = new PropertyAddressPage(page);

  await propertyAddress.rejectCookies();

  await propertyAddress.enterAddress(properties[10]["Address"]);
  await propertyAddress.selectFullAddress(properties[10]["Full Address"]);
  await propertyAddress.notInstallingInAreaMessage();
});

test(`E2E scenarios for house BS15 4JH with fuel = other`, async ({ page }) => {
  await e2e(page, properties[11]);
});

test(`E2E scenarios for house SW1A 0AA`, async ({ page }) => {
  await requestEstimation(page, properties[12]);
});

test(`E2E scenarios for house JE2 4TJ`, async ({ page }) => {
  await requestEstimation(page, properties[13]);
});

test(`E2E scenarios for house RG20 7LU`, async ({ page }) => {
  await requestEstimation(page, properties[14]);
});

test(`E2E scenarios for house TQ9 6FQ`, async ({ page }) => {
  await requestEstimation(page, properties[15]);
});

test(`E2E scenarios for house BS5 9DT`, async ({ page }) => {
  await requestEstimation(page, properties[16]);
});

test(`E2E scenarios for house HP17 8JN`, async ({ page }) => {
  await requestEstimation(page, properties[17]);
});

test(`E2E scenarios for house BA11 5LW`, async ({ page }) => {
  await requestEstimation(page, properties[18]);
});
