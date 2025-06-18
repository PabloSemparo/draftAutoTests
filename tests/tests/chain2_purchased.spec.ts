import { test, expect } from "@playwright/test";
import { CollectionStrategyPage } from "../../src/pages/CollectionStrategyPage";
import { ContractsPage } from "../../src/pages/ContractsPage";
import { ResponsibleAssignmentPage } from "../../src/pages/ResponsibleAssignmentPage";
import { PaymentPage } from "../../src/pages/PaymentPage";
import { UnrecognizedPaymentsRegistryPage } from "../../src/pages/attachPaymentOrderToContract";
import { navigateToContracts } from "../../src/utils/navigation";

let contractChain2Purchased: string;

test.beforeEach(async ({ page }) => {
  console.log("🔹 beforeEach: переход на страницу договоров");
  await navigateToContracts(page);
});

test.describe
  .serial("Цепочка 2 (Купленные): Назначение стратегии и работы с договором", () => {
  test("Шаг 1: Назначение стратегии для купленных", async ({ page }) => {
    const strategyPage = new CollectionStrategyPage(page);
    await strategyPage.goToStrategyPage();
    await strategyPage.selectContractForPurchased();
    contractChain2Purchased = await strategyPage.getSelectedContractNumber();
    await strategyPage.assignProcessPurchased();

    const contractsPage = new ContractsPage(page);
    expect(
      await contractsPage.verifyContractIsLoaded(contractChain2Purchased)
    ).toBeTruthy();
  });

  test("Шаг 2: Назначение ответственного", async ({ page }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.searchContractByNumber(contractChain2Purchased);

    const responsiblePage = new ResponsibleAssignmentPage(page);
    await responsiblePage.assignResponsible(contractChain2Purchased);
  });

  test("Шаг 3: Оплата ГП мирового суда", async ({ page }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.selectContractAndOpen(contractChain2Purchased);

    const paymentPage = new PaymentPage(page);
    await paymentPage.payCourtStateDuty();
  });

  test("Шаг 4: Переназначение ответственного", async ({ page }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.searchContractByNumber(contractChain2Purchased);

    const responsiblePage = new ResponsibleAssignmentPage(page);
    await responsiblePage.reassignResponsible(
      contractChain2Purchased,
      "Алиева Юлия Дмитриевна"
    );
  });

  test("Шаг 5: Повторная оплата ГП мирового суда", async ({ page }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.selectContractAndOpen(contractChain2Purchased);

    const paymentPage = new PaymentPage(page);
    await paymentPage.payCourtStateDuty();
  });

  test("Шаг 8: Ручная привязка платёжного поручения", async ({ page }) => {
    await page.goto("/court-payment-receipt");
    await expect(page).toHaveURL("/court-payment-receipt");

    const registryPage = new UnrecognizedPaymentsRegistryPage(page);
    await registryPage.attachPaymentOrderToContract(contractChain2Purchased);
  });
});
