import { test, expect } from "@playwright/test";
import { CollectionStrategyPage } from "../../src/pages/CollectionStrategyPage";
import { ContractsPage } from "../../src/pages/ContractsPage";
import { ResponsibleAssignmentPage } from "../../src/pages/ResponsibleAssignmentPage";
import { PaymentPage } from "../../src/pages/PaymentPage";
import { navigateToContracts } from "../../src/utils/navigation";

let contractChain1Purchased: string;

test.beforeEach(async ({ page }) => {
  console.log("beforeEach: переход на страницу договоров");
  await navigateToContracts(page);
});

test.describe
  .serial("Цепочка 1 для купленных: Назначение стратегии, ответственного и оплата ГП", () => {
  test("Цепочка 1 для купленных. Шаг 1. Назначение стратегии", async ({
    page,
  }) => {
    const strategyPage = new CollectionStrategyPage(page);
    await strategyPage.goToStrategyPage();
    await strategyPage.selectContractForPurchased();
    contractChain1Purchased = await strategyPage.getSelectedContractNumber();
    await strategyPage.assignProcess("Взыскание ОСВ для купленных");

    const contractsPage = new ContractsPage(page);
    expect(
      await contractsPage.verifyContractIsLoaded(contractChain1Purchased)
    ).toBeTruthy();
  });

  test("Цепочка 1 для купленных. Шаг 2. Назначение ответственного", async ({
    page,
  }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.searchContractByNumber(contractChain1Purchased);

    const responsiblePage = new ResponsibleAssignmentPage(page);
    await responsiblePage.assignResponsible(contractChain1Purchased);
  });

  test("Цепочка 1 для купленных. Шаг 3. Оплата ГП мирового суда", async ({
    page,
  }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.selectContractAndOpen(contractChain1Purchased);

    const paymentPage = new PaymentPage(page);
    await paymentPage.payCourtStateDuty();
  });

  test("Цепочка 1 для купленных. Шаг 4. Переназначение ответственного", async ({
    page,
  }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.searchContractByNumber(contractChain1Purchased);

    const responsiblePage = new ResponsibleAssignmentPage(page);
    await responsiblePage.reassignResponsible(
      contractChain1Purchased,
      "Алиева Юлия Дмитриевна" // можно тоже вынести в ENV, если потребуется
    );
  });
});
