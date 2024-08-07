import { test } from "@playwright/test";
import * as csv from "fast-csv";
import { requestEstimation } from "../../helpers/e2eSteps";

let properties;

test.beforeAll(async () => {
  const myObject = new Promise((resolve) => {
    const dataArray: JSON[] = [];
    csv
      .parseFile("data/waterCylinder.csv", { headers: true })
      .on("data", (data) => {
        dataArray.push(data);
      })
      .on("end", () => {
        resolve(dataArray);
      });
  });
  properties = await myObject;
});

test(`Quote for Heat Pump with no existing water cylinder - 210L(CB22 5BN)`, async ({ page }) => {
  await requestEstimation(page, properties[0]);
});

test(`Quote for Heat Pump with existing water cylinder - 210L(CB22 5BN)`, async ({ page }) => {
  await requestEstimation(page, properties[1]);
});

test(`Quote for Heat Pump with existing electric boiler(CB22 5BN)`, async ({ page }) => {
  await requestEstimation(page, properties[2]);
});

test(`Quote for Heat Pump with no existing water cylinder - 250L(RG31 6JY)`, async ({ page }) => {
  await requestEstimation(page, properties[3]);
});

test(`Quote for Heat Pump with existing water cylinder - 250L(RG31 6JY)`, async ({ page }) => {
  await requestEstimation(page, properties[4]);
});

test(`Quote for Heat Pump with existing electric boiler(RG31 6JY)`, async ({ page }) => {
  await requestEstimation(page, properties[5]);
});

test(`Quote for Heat Pump with no existing water cylinder - 300L(BS8 3LB)`, async ({ page }) => {
  await requestEstimation(page, properties[6]);
});

test(`Quote for Heat Pump with existing water cylinder - 300L(BS8 3LB)`, async ({ page }) => {
  await requestEstimation(page, properties[7]);
});

test(`Quote for Heat Pump with existing electric boiler(BS8 3LB)`, async ({ page }) => {
  await requestEstimation(page, properties[8]);
});
