import { test, expect } from "@playwright/test";
import { RetrieveEstimationPage } from "../../pages/retrieveEstimation";
import { EstimationPage } from "../../pages/estimationPage";
import { Headers } from "../../helpers/headers";

test(`Retrieve estimation`, async ({ page }) => {
  await page.goto(
    "https://main.d1nxhs3o2gh5ix.amplifyapp.com/configure/heat-pump/my-estimate?id=7aad4106-97de-4880-9b39-5376b861be87"
  );

  await expect(page).toHaveTitle(/Good Energy Heating/);

  const retrieveEstimation = new RetrieveEstimationPage(page);
  await retrieveEstimation.rejectCookies();
  await expect(await page.getByRole("heading", { name: Headers.pleaseConfirmAddress })).toBeVisible();

  await retrieveEstimation.enterAddress("3 Forge End, CB22 5BN", "3 Forge End, Stapleford, Cambridge, Cambridgeshire");
  await retrieveEstimation.continue();

  const estimation = new EstimationPage(page);

  await expect(await estimation.getEstimationElement()).toContainText(`Your estimated cost is £7,100`);
});
