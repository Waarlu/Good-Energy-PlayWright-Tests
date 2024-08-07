import { Locator, Page } from "@playwright/test";

export class EstimationPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async getEstimationElement(): Promise<Locator> {
    return await this.page.getByRole("heading", { name: "Your estimated cost is £" });
  }

  async getEstimationReferenceElement(): Promise<Locator> {
    return await this.page.getByText("Estimate reference: ");
  }

  private async openDiscountAccordion() {
    await this.page.getByText("Add a referral or discount code").click();
  }

  private async insertDiscountCode(discountCode: string) {
    await this.page.locator("#discountCode").fill(discountCode);
  }

  private async applyDiscountCode() {
    await this.page.getByRole("button", { name: "Apply" }).click();
  }

  async applyDiscount(discountCode: string) {
    await this.openDiscountAccordion();
    await this.insertDiscountCode(discountCode);
    await this.applyDiscountCode();
  }

  async discountCodeApplied(): Promise<Locator[]> {
    return [this.page.locator(`//*[text()='Discount Applied']`), this.page.locator(`//*[text()='-£100']`)];
  }

  async findTextInEstimationPage(text: string): Promise<Locator> {
    return this.page.locator(`//*[text()='${text}']`);
  }
}
