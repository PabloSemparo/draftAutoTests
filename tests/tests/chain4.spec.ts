import { test, expect } from "@playwright/test";
import { CollectionStrategyPage } from "../../src/pages/CollectionStrategyPage";
import { ContractsPage } from "../../src/pages/ContractsPage";
import { ResponsibleAssignmentPage } from "../../src/pages/ResponsibleAssignmentPage";
import { PaymentPage } from "../../src/pages/PaymentPage";
import { UnrecognizedPaymentsRegistryPage } from "../../src/pages/attachPaymentOrderToContract";
import { navigateToContracts } from "../../src/utils/navigation";

let contractChain4: string;

test.describe
  .serial("Цепочка 4: Назначение стратегии, ответственного и ручная привязка", () => {
  test.beforeEach(async ({ page }) => {
    console.log("beforeEach: переход на страницу договоров");
    await navigateToContracts(page);
  });

  test("Цепочка 4. Шаг 1: Назначение стратегии", async ({ page }) => {
    const strategyPage = new CollectionStrategyPage(page);
    await strategyPage.goToStrategyPage();
    await strategyPage.selectContract();
    contractChain4 = await strategyPage.getSelectedContractNumber();
    await strategyPage.assignProcess("Взыскание ОСВ");

    const contractsPage = new ContractsPage(page);
    expect(
      await contractsPage.verifyContractIsLoaded(contractChain4)
    ).toBeTruthy();
  });

  test("Цепочка 4. Шаг 2: Назначение ответственного", async ({ page }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.searchContractByNumber(contractChain4);

    const responsiblePage = new ResponsibleAssignmentPage(page);
    await responsiblePage.assignResponsible(contractChain4);
  });

  test("Цепочка 4. Шаг 3: Оплата ГП мирового суда", async ({ page }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.selectContractAndOpen(contractChain4);

    const paymentPage = new PaymentPage(page);
    await paymentPage.payCourtStateDuty();
  });

  test("Цепочка 4. Шаг 4: Ручная привязка платёжного поручения", async ({
    page,
  }) => {
    await page.goto("/court-payment-receipt");
    await expect(page).toHaveURL("/court-payment-receipt");

    const registryPage = new UnrecognizedPaymentsRegistryPage(page);
    await registryPage.attachPaymentOrderToContract(contractChain4);
  });
});
