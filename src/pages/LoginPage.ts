import { Page, Locator } from "@playwright/test";

export class LoginPage {
  private page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: '* Логин' });
    this.passwordInput = page.getByRole('textbox', { name: '* Пароль' });
    this.loginButton = page.locator("button.el-button--primary:has-text('Войти')");
  }

  async login(username: string, password: string) {
    console.log("🔹 Вход в систему...");
    await this.page.goto("https://lc.test5.mmk.local/auth");
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState("networkidle");
  }
}
