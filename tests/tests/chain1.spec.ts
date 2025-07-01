import { test, expect } from "@playwright/test";
import { CollectionStrategyPage } from "../../src/pages/CollectionStrategyPage";
import { ContractsPage } from "../../src/pages/ContractsPage";
import { ResponsibleAssignmentPage } from "../../src/pages/ResponsibleAssignmentPage";
import { PaymentPage } from "../../src/pages/PaymentPage";
import { navigateToContracts } from "../../src/utils/navigation";
import { LoginPage } from "../../src/pages/LoginPage";

let contractChain1: string;

test.beforeEach(async ({ page }) => {
  console.log("beforeEach: переход на страницу договоров");
  await navigateToContracts(page);
});

test.describe
  .serial("Цепочка 1: Назначение стратегии, ответственного и оплата ГП", () => {
  test("Цепочка 1. Шаг 1: Назначение стратегии", async ({ page }) => {
    const strategyPage = new CollectionStrategyPage(page);
    await strategyPage.goToStrategyPage();
    await strategyPage.selectContract();
    contractChain1 = await strategyPage.getSelectedContractNumber();
    await strategyPage.assignProcess("Взыскание ОСВ");

    const contractsPage = new ContractsPage(page);
    expect(
      await contractsPage.verifyContractIsLoaded(contractChain1)
    ).toBeTruthy();
  });

  test("Цепочка 1. Шаг 2: Назначение ответственного", async ({ page }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.searchContractByNumber(contractChain1);

    const responsiblePage = new ResponsibleAssignmentPage(page);
    await responsiblePage.assignResponsible(contractChain1);
  });

  test("Цепочка 1. Шаг 3: Оплата ГП мирового суда", async ({ page }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.selectContractAndOpen(contractChain1);

    const paymentPage = new PaymentPage(page);
    await paymentPage.payCourtStateDuty();
  });

  test("Цепочка 1. Шаг 4: Переназначение ответственного", async ({ page }) => {
    const contractsPage = new ContractsPage(page);
    await contractsPage.searchContractByNumber(contractChain1);

    const responsiblePage = new ResponsibleAssignmentPage(page);
    await responsiblePage.reassignResponsible(
      contractChain1,
      "Алиева Юлия Дмитриевна"
    );
  });
});
