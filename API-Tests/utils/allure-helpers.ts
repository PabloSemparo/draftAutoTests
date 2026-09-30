/**
 * Вспомогательные функции для Allure
 */

export class AllureHelpers {
  /**
   * Прикрепление ответа API к отчету
   */
  static async attachApiResponse(response: any, name: string = 'API Response'): Promise<void> {
    const contentType = response.headers?.get('content-type');
    const body = await response.text();

    if (contentType?.includes('application/json')) {
      await allure.attachment(name, JSON.stringify(JSON.parse(body), null, 2), 'application/json');
    } else {
      await allure.attachment(name, body, 'text/plain');
    }
  }

  /**
   * Прикрепление информации о окружении
   */
  static async attachEnvironmentInfo(): Promise<void> {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      CI: process.env.CI,
      BUILD_NUMBER: process.env.BUILD_NUMBER,
      BRANCH: process.env.BRANCH,
    };

    await allure.attachment('Environment Info', JSON.stringify(envInfo, null, 2), 'application/json');
  }

  /**
   * Запуск теста с именем и описанием
   */
  static async startTest(name: string, description?: string): Promise<void> {
    await allure.test(name, description);
  }
}