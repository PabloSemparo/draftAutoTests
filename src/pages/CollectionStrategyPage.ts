import { Page, Locator, expect } from "@playwright/test";

export class CollectionStrategyPage {
  private page: Page;
  private strategyMenu: Locator;
  private assignProcessButton: Locator;
  private processDropdown: Locator;
  private processOCB: Locator;
  private assignToSelectedContractsButton: Locator;
  private nextPageButton: Locator;
  private selectedContractNumber: string | null = null;

  constructor(page: Page) {
    this.page = page;
    this.strategyMenu = page.locator(
      "span.menu-item-title:has-text('Стратегия взыскания')"
    );
    this.assignProcessButton = page.locator(
      "button:has-text('Назначить процесс')"
    );
    this.processDropdown = page.getByRole("combobox", {
      name: "Выберите процесс",
    });
    this.assignToSelectedContractsButton = page.locator(
      "button:has-text('Назначить к выбранным договорам')"
    );
    this.processOCB = page.getByRole("option", {
      name: "Взыскание ОСВ",
      exact: true,
    });
    this.nextPageButton = page
      .locator(".el-pagination .btn-next:not([disabled])")
      .first();
  }

  async goToStrategyPage() {
    console.log("🔹 Переход в 'Стратегия взыскания'...");
    await this.strategyMenu.click();
    await this.page.waitForLoadState("networkidle");
  }

  async filterByOrganization() {
    console.log("🔹 Применяем фильтр по организации 'Турбозайм'...");

    await this.page.getByRole("combobox", { name: "Колонка" }).click();
    await this.page.getByRole("option", { name: "Организация" }).click();
    await this.page.getByRole("combobox", { name: "Вид фильтрации" }).click();
    await this.page.getByRole("option", { name: "Содержит" }).click();
    await this.page
      .getByRole("textbox", { name: "Значение" })
      .fill("Турбозайм");
    await this.page.getByRole("button", { name: "Применить" }).click();

    await this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/v1/importedcontractpackage/table") &&
        response.status() === 200
    );
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(3000);
  }

  async selectContract() {
    console.log("🔹 Ищем договор c 'АА'...");

    await this.filterByOrganization();
    await this.searchContract(
      (contractNumber, status) =>
        contractNumber.startsWith("АА") &&
        status !== "Клиент банкрот" &&
        status !== "Статус банкротства не ясен"
    );
  }

  async selectContractForPurchased() {
    //console.log("🔹 Ищем договор для купленных (без 'АА')...");

    // await this.filterByOrganization();
    await this.searchContract(
      (contractNumber, status) =>
        !contractNumber.startsWith("АА") &&
        status !== "Клиент банкрот" &&
        status !== "Статус банкротства не ясен"
    );
  }

  private async searchContract(
    condition: (contractNumber: string, status: string) => boolean
  ) {
    let currentPage = 1;

    while (true) {
      await this.page.waitForSelector("tbody tr", {
        state: "visible",
        timeout: 10000,
      });
      const rows = await this.page.locator("tbody tr").all();

      for (const row of rows) {
        const contractNumberElement = row.locator("td:nth-child(2) span");
        const statusElement = row.locator("td:nth-child(7)");

        const contractNumber =
          (await contractNumberElement.textContent())?.trim() || "";
        const status = (await statusElement.textContent())?.trim() || "";

        console.log(`Проверяем договор: ${contractNumber} | Статус: ${status}`);

        if (condition(contractNumber, status)) {
          console.log(`✅ Найден подходящий договор: ${contractNumber}`);

          await contractNumberElement.scrollIntoViewIfNeeded();
          const checkbox = row.locator(
            ".table-select-checkbox .el-checkbox__inner"
          );
          await checkbox.click();
          await this.page.waitForTimeout(1000);

          this.selectedContractNumber = contractNumber;
          return;
        }
      }

      if (await this.nextPageButton.isVisible()) {
        console.log(`🔹 Переходим на следующую страницу ${currentPage + 1}...`);
        await this.nextPageButton.click();
        await this.page.waitForTimeout(2000);
      } else {
        throw new Error("❌ Не найден подходящий договор после всех страниц!");
      }

      currentPage++;
    }
  }

  async getSelectedContractNumber(): Promise<string> {
    if (!this.selectedContractNumber) {
      throw new Error("❌ Ошибка: Не выбран договор!");
    }
    console.log(`✅ Выбран договор: ${this.selectedContractNumber}`);
    return this.selectedContractNumber;
  }

  async assignProcess(processName: string) {
    console.log(`🔹 Назначаем процесс: ${processName}`);

    await this.assignProcessButton.click();
    await this.processDropdown.click();
    await this.processOCB.click();
    await this.assignToSelectedContractsButton.click();
    console.log("✅ Процесс назначен успешно!");
  }

  async assignProcessPurchased() {
    console.log("🔹 Назначаем процесс 'Взыскание ОСВ для купленных'...");

    await this.assignProcessButton.click();
    await this.processDropdown.click();

    const processForPurchased = this.page.getByRole("option", {
      name: "Взыскание ОСВ для купленных",
      exact: true,
    });

    await processForPurchased.click();
    await this.assignToSelectedContractsButton.click();

    console.log("✅ Процесс 'Взыскание ОСВ для купленных' успешно назначен!");
  }
}
