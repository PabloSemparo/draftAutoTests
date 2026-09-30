/**
 * Allure декораторы - централизованное управление Allure метаданными
 */

import { allure } from 'allure-playwright';

/**
 * Класс для удобного управления Allure отчетами
 */
export class AllureDecorators {
  /**
   * Установка эпика
   */
  static async epic(epic: string): Promise<void> {
    await allure.epic(epic);
  }

  /**
   * Установка фичи
   */
  static async feature(feature: string): Promise<void> {
    await allure.feature(feature);
  }

  /**
   * Установка истории
   */
  static async story(story: string): Promise<void> {
    await allure.story(story);
  }

  /**
   * Установка критичности
   */
  static async severity(severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'): Promise<void> {
    await allure.severity(severity);
  }

  /**
   * Установка тега
   */
  static async tag(tag: string): Promise<void> {
    await allure.tag(tag);
  }

  /**
   * Прикрепление JSON данных
   */
  static async attachJson(name: string, data: unknown): Promise<void> {
    await allure.attachment(name, JSON.stringify(data, null, 2), 'application/json');
  }

  /**
   * Прикрепление текстового файла
   */
  static async attachText(name: string, text: string): Promise<void> {
    await allure.attachment(name, text, 'text/plain');
  }

  /**
   * Создание шага (асинхронный)
   */
  static async step<T>(name: string, body: () => Promise<T>): Promise<T> {
    return await allure.step(name, body);
  }

  /**
   * Создание шага (синхронный)
   */
  static stepSync<T>(name: string, body: () => T): T {
    return allure.step(name, body);
  }

  /**
   * Установка параметра
   */
  static async parameter(name: string, value: string | number | boolean): Promise<void> {
    await allure.parameter(name, String(value));
  }

  /**
   * Установка родительского сьюта
   */
  static async parentSuite(suite: string): Promise<void> {
    await allure.parentSuite(suite);
  }

  /**
   * Установка сьюта
   */
  static async suite(suite: string): Promise<void> {
    await allure.suite(suite);
  }

  /**
   * Установка подсьюта
   */
  static async subSuite(subSuite: string): Promise<void> {
    await allure.subSuite(subSuite);
  }

  /**
   * Установка селектора
   */
  static async selector(selector: string): Promise<void> {
    await allure.selector(selector);
  }
}

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
      await AllureDecorators.attachJson(name, JSON.parse(body));
    } else {
      await AllureDecorators.attachText(name, body);
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

    await AllureDecorators.attachJson('Environment Info', envInfo);
  }

  /**
   * Запуск теста с именем и описанием
   */
  static async startTest(name: string, description?: string): Promise<void> {
    await allure.test(name, description);
  }
}

// Экспорт утилит для удобства
export { AllureDecorators as Allure, AllureHelpers };