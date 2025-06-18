import { test, expect } from "@playwright/test";
import { CollectionStrategyPage } from "../../src/pages/CollectionStrategyPage";
import { ContractsPage } from "../../src/pages/ContractsPage";
import { ResponsibleAssignmentPage } from "../../src/pages/ResponsibleAssignmentPage";
import { PaymentPage } from "../../src/pages/PaymentPage";
import { UnrecognizedPaymentsRegistryPage } from "../../src/pages/attachPaymentOrderToContract";
import { navigateToContracts } from "../../src/utils/navigation";

let contractChain4Purchased: string;

test.beforeEach(async ({ page }) => {
  console.log("🔹 beforeEach: переход на страницу договоров...");
  await navigateToContracts(page);
});

test.describe
  .serial("Цепочка 4 (покупные): Назначение стратегии и ответственного", () => {
  test("Цепочка 4 купленных. Шаг 1: Назначение стратегии", async ({ page }) => {
    const strategyPage = new CollectionStrategyPage(page);
    await strategyPage.goToStrategyPage();
    await strategyPage.selectContractForPurchased();
    contractChain4Purchased = await strategyPage.getSelectedContractNumber();
    await strategyPage.assignProcessPurchased();

    const contractsPage = new ContractsPage(page);
    expect(
      await contractsPage.verifyContractIsLoaded(contractChain4Purchased)
    ).toBeTruthy();
  });

  test("Цепочка 4 купленных. Шаг 2: Назначение ответственного", async ({
    page,
  }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.searchContractByNumber(contractChain4Purchased);

    const responsiblePage = new ResponsibleAssignmentPage(page);
    await responsiblePage.assignResponsible(contractChain4Purchased);
  });

  test("Цепочка 4 купленных. Шаг 3: Оплата ГП мирового суда", async ({
    page,
  }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.selectContractAndOpen(contractChain4Purchased);

    const paymentPage = new PaymentPage(page);
    await paymentPage.payCourtStateDuty();
  });

  test("Цепочка 4 купленных. Шаг 4: Ручная привязка платежного поручения", async ({
    page,
  }) => {
    const registryPage = new UnrecognizedPaymentsRegistryPage(page);
    await page.goto("/court-payment-receipt");
    await expect(page).toHaveURL("/court-payment-receipt");

    await registryPage.attachPaymentOrderToContract(contractChain4Purchased);
  });
});
