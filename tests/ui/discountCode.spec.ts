import { expect, test } from "@playwright/test";

import * as csv from "fast-csv";
import { requestEstimation } from "../../helpers/e2eSteps";
import { EstimationPage } from "../../pages/estimationPage";

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

test(`User can insert a discount`, async ({ page }) => {
  await requestEstimation(page, properties[1]);
  const estimation = new EstimationPage(page);
  await estimation.applyDiscount("TEST2024");

  const discountApplied = await estimation.discountCodeApplied();
  for (const discountText of discountApplied) {
    await expect(await discountText).toBeVisible();
  }

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });

  await expect(await estimation.getEstimationElement()).toContainText(
    `Your estimated cost is ${formatter.format(properties[1]["Total cost"] - 7500)}`
  );

  await expect(
    await estimation.findTextInEstimationPage(formatter.format(parseInt(properties[1]["Total cost"]) - 7600))
  ).toBeVisible();
});
