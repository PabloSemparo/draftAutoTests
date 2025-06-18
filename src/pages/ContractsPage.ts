import { Page, Locator, expect } from "@playwright/test";

export class ContractsPage {
  private page: Page;
  private contractsTable: Locator;
  private columnFilter: Locator;
  private contractNumberOption: Locator;
  private valueInput: Locator;
  private applyFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contractsTable = page.locator(".el-table__row td:nth-child(3) a");
    this.columnFilter = page.getByRole("combobox", { name: "Колонка" });
    this.contractNumberOption = page.getByRole("option", {
      name: "Номер договора",
      exact: true,
    });
    this.valueInput = page.getByRole("textbox", { name: "Значение" });
    this.applyFilterButton = page.getByRole("button", { name: "Применить" });
  }

  async verifyContractIsNotInStrategy() {
    console.log("🔹 Проверяем, что договор исчез из 'Стратегии взыскания'...");
    await this.page.reload();
    await this.page.waitForLoadState("networkidle");

    if (await this.contractsTable.isVisible()) {
      return !(await this.contractsTable.textContent())?.includes(
        "Выбранный договор"
      );
    }
    return true;
  }

  async searchContractByNumber(contractNumber: string) {
    await this.page.goto("https://lc.test5.mmk.local/contracts");
    await this.page.waitForLoadState("networkidle");

    // Открываем фильтр
    await this.columnFilter.click();
    await this.contractNumberOption.click();

    // Ввод номера договора
    await this.valueInput.fill(contractNumber);

    await this.applyFilterButton.click();

    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState("networkidle");
  }

  async verifyContractIsLoaded(contractNumber: string) {
    console.log(
      `🔹 Ищем договор с номером: ${contractNumber} на странице 'Договоры'...`
    );

    await this.searchContractByNumber(contractNumber);

    // ищем конкретную ссылку по тексту номера договора
    const contractLocator = this.page.getByRole("link", {
      name: contractNumber,
    });

    console.log(
      `🔹 Проверка: есть ли договор ${contractNumber} на странице...`
    );

    //  ✅ Ожидаем появления договора
    await expect(contractLocator).toBeVisible({ timeout: 15000 });

    console.log(`✅ Договор ${contractNumber} успешно найден!`);
    return true;
  }

  async selectContractAndOpen(contractNumber: string) {
    console.log(`🔹 Ищем договор по номеру: ${contractNumber}...`);

    await this.searchContractByNumber(contractNumber);

    await this.applyFilterButton.click();
    console.log("✅ Фильтр применён!");

    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);

    // 🔹 Находим ссылку на договор и кликаем по ней
    const contractLink = this.page.getByRole("link", { name: contractNumber });

    if ((await contractLink.count()) > 0) {
      await contractLink.click();
      console.log(`✅ Перешли в карточку договора ${contractNumber}`);
    } else {
      throw new Error(`❌ Ошибка: Договор ${contractNumber} не найден!`);
    }
  }
}
