import { Page, Locator } from "@playwright/test";

export class PaymentPage {
  private page: Page;
  private operationsButton: Locator;
  private stateDutyOption: Locator;
  private executeButton: Locator;
  private dutyTypeDropdown: Locator;
  private courtDutyOption: Locator;
  private sendRequestButton: Locator;
  private confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.operationsButton = page.getByRole("button", { name: "Операции" });
    this.stateDutyOption = page.getByText("Оплата госпошлины", { exact: true });
    this.executeButton = page.getByRole("button", { name: "Выполнить" });
    this.dutyTypeDropdown = page.getByRole("combobox", {
      name: "Выберите тип госпошлины",
    });
    this.courtDutyOption = page.getByRole("option", {
      name: "Госпошлина для вынесения судебного приказа",
    });
    this.sendRequestButton = page.getByRole("button", {
      name: "Отправить запрос для оплаты гос. пошлины",
    });
    this.confirmButton = page.getByRole("button", { name: "Подтвердить" });
  }

  async payCourtStateDuty() {
    console.log("🔹 Начинаем оплату госпошлины...");

    await Promise.all([
      this.operationsButton.click(),
      this.page.waitForResponse(
        (response) =>
          response
            .url()
            .includes("/api/v1/contract/available_user_operations") &&
          response.status() === 200
      ),
    ]);
    await this.stateDutyOption.click();
    await this.executeButton.click();
    await this.dutyTypeDropdown.click();
    await this.courtDutyOption.click();
    await this.sendRequestButton.click();
    await Promise.all([
      this.confirmButton.click(),
      this.page.waitForResponse(
        (response) =>
          response.url().includes("/api/v1/taxpayment/start_magistrate") &&
          response.status() === 200
      ),
    ]);

    console.log("✅ Оплата госпошлины успешно завершена!");
  }
}
