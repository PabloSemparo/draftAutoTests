import { Page, Locator, expect } from "@playwright/test";

export class UnrecognizedPaymentsRegistryPage {
  private page: Page;
  private registryTab;
  private attachPaymentButton;
  private contractNumberDropdown;
  private documentTypeDropdown;
  private documentTypeOption;
  private paymentDateInput;
  private paymentNumberInput;
  private attachButton;

  constructor(page: Page) {
    this.page = page;
    this.registryTab = page.getByRole("link", {
      name: "Реестр неразобранных платежных поручений",
    });
    this.attachPaymentButton = page.locator(
      "tbody tr:first-child .el-button.el-button--primary"
    );
    this.contractNumberDropdown = page.getByRole("combobox", {
      name: "*Номер договора",
    });
    this.documentTypeDropdown = page.getByRole("combobox", {
      name: "*Тип документа",
    });
    this.documentTypeOption = page.getByText(
      "Платежный документ (госпошлина) мирового суда"
    );
    this.paymentDateInput = page.getByRole("textbox", { name: "*Дата оплаты" });
    this.paymentNumberInput = page.getByRole("textbox", {
      name: "*Номер платежного поручения",
    });
    this.attachButton = page.getByRole("button", {
      name: "Прикрепить документ",
    });
  }

  async attachPaymentOrderToContract(contractNumber: string) {
    if (!contractNumber) {
      throw new Error(
        "❌ Ошибка: Номер договора не передан в `attachPaymentOrderToContract`!"
      );
    }

    console.log(
      "🔹 Открываем вкладку 'Реестр неразобранных платежных поручений'..."
    );
    await this.registryTab.click();
    await this.page.waitForLoadState("networkidle");

    console.log("🔹 Ищем платежное поручение...");
    await this.page.waitForTimeout(2000);

    console.log("🔹 Нажимаем 'Прикрепить платежный документ к договору'...");
    await this.attachPaymentButton.click();
    await this.page.waitForLoadState("networkidle");

    console.log(`🔹 Выбираем номер договора: ${contractNumber}...`);
    await this.contractNumberDropdown.click();
    await this.contractNumberDropdown.fill(contractNumber);

    // 🔹 Ожидаем загрузку страницы и завершение API-запроса
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/v1/contract/table") &&
        response.status() === 200
    );

    // 🔹 Находим и кликаем по нужному договору в списке
    const selectedContract = this.page.locator(".el-select-dropdown__item", {
      hasText: contractNumber,
    });
    await selectedContract.click();

    await this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/v1/contract/table") &&
        response.status() === 200
    );

    console.log("🔹 Выбираем тип документа...");
    await this.documentTypeDropdown.click();
    await this.documentTypeOption.click();

    console.log("🔹 Заполняем дату оплаты...");
    const today = new Date().toISOString().split("T")[0];
    await this.paymentDateInput.fill(today);

    console.log("🔹 Заполняем номер платежного поручения...");
    await this.paymentNumberInput.fill("7777");

    console.log("🔹 Подтверждаем привязку платежа...");
    await this.attachButton.click();

    console.log("✅ Операция выполнена успешно!");
  }
}
