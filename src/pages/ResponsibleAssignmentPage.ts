import { Page, Locator, expect } from "@playwright/test";

export class ResponsibleAssignmentPage {
  private page: Page;
  private contractLink: Locator;
  private operationsButton: Locator;
  private assignResponsibleOption: Locator;
  private executeButton: Locator;
  private responsibleDropdown: Locator;
  private confirmResponsibleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contractLink = page.getByRole("link", { name: "АА" });
    this.operationsButton = page.getByRole("button", { name: "Операции" });
    this.assignResponsibleOption = page.getByText("Назначить ответственного");
    this.executeButton = page.getByRole("button", { name: "Выполнить" });
    this.responsibleDropdown = page.getByRole("combobox", {
      name: "Выберите ответственное лицо",
    });
    this.confirmResponsibleButton = page.getByRole("button", {
      name: "Указать ответственное лицо",
    });
  }

  async assignResponsible(contractNumber: string) {
    console.log(`🔹 Переход в договор: ${contractNumber}`);

    await this.page.getByRole("link", { name: contractNumber }).click();
    await this.page.waitForLoadState("networkidle");

    console.log("🔹 Открываем меню 'Операции'...");
    await this.operationsButton.click();

    console.log("🔹 Выбираем 'Назначить ответственного'...");
    await this.assignResponsibleOption.click();

    console.log("🔹 Подтверждаем выбор...");
    await this.executeButton.click();

    console.log("🔹 Открываем выпадающий список ответственных лиц...");
    await this.responsibleDropdown.click();
    await this.page.waitForTimeout(3000);

    const visibleDropdown = this.page
      .locator(".el-select-dropdown")
      .filter({ has: this.page.locator(":visible") });
    await visibleDropdown.locator(".el-select-dropdown__item").first().click();

    console.log("🔹 Подтверждаем назначение ответственного...");
    await Promise.all([
      this.confirmResponsibleButton.click(),
      this.page.waitForResponse(
        (response) =>
          response.url().includes("/api/v1/contract/set_responsible") &&
          response.status() === 200
      ),
    ]);
    console.log("✅ Ответственный назначен.");
  }

  async reassignResponsible(contractNumber: string, employeeName: string) {
    console.log(
      `🔹 Переназначаем ответственного для договора: ${contractNumber}`
    );

    await this.page.getByRole("link", { name: contractNumber }).click();
    await this.page.waitForLoadState("networkidle");

    await this.operationsButton.click();
    await this.assignResponsibleOption.click();
    await this.executeButton.click();

    await this.responsibleDropdown.click();
    await this.page.getByRole("option", { name: employeeName }).click();

    await Promise.all([
      this.confirmResponsibleButton.click(),
      this.page.waitForResponse(
        (res) =>
          res.url().includes("/api/v1/contract/set_responsible") &&
          res.status() === 200
      ),
    ]);

    console.log(`✅ Ответственный \"${employeeName}\" успешно назначен.`);
  }
}
