/**
 * Allure helpers - централизованное управление Allure метаданными
 */

import { allure } from 'allure-playwright';

/**
 * Класс для удобного управления Allure метаданными
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
  static async severity(
    severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'
  ): Promise<void> {
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
  static async attachJson(
    name: string,
    data: unknown
  ): Promise<void> {
    await allure.attachment(
      name,
      JSON.stringify(data, null, 2),
      'application/json'
    );
  }

  /**
   * Прикрепление текстовых данных
   */
  static async attachText(
    name: string,
    text: string
  ): Promise<void> {
    await allure.attachment(
      name,
      text,
      'text/plain'
    );
  }

  /**
   * Создание Allure шага.
   *
   * В Legacy API allure.step() не возвращает результат callback.
   * Поэтому результат сохраняется отдельно и возвращается после выполнения шага.
   */
  static async step<T>(
    name: string,
    body: () => T | Promise<T>
  ): Promise<T> {
    let result!: T;

    await allure.step(name, async () => {
      result = await body();
    });

    return result;
  }

  /**
   * Установка параметра
   */
  static async parameter(
    name: string,
    value: string | number | boolean
  ): Promise<void> {
    await allure.parameter(
      name,
      String(value)
    );
  }

  /**
   * Установка родительского сьюта
   */
  static async parentSuite(
    suite: string
  ): Promise<void> {
    await allure.parentSuite(suite);
  }

  /**
   * Установка сьюта
   */
  static async suite(
    suite: string
  ): Promise<void> {
    await allure.suite(suite);
  }

  /**
   * Установка подсьюта
   */
  static async subSuite(
    subSuite: string
  ): Promise<void> {
    await allure.subSuite(subSuite);
  }
}

/**
 * Минимальный интерфейс API response,
 * необходимый для прикрепления ответа к Allure.
 */
interface ApiResponse {
  headers?: {
    get(name: string): string | null;
  };

  text(): Promise<string>;
}

/**
 * Вспомогательные функции для Allure
 */
export class AllureHelpers {
  /**
   * Прикрепление ответа API к отчету
   */
  static async attachApiResponse(
    response: ApiResponse,
    name: string = 'API Response'
  ): Promise<void> {
    const contentType =
      response.headers?.get('content-type');

    const body = await response.text();

    if (contentType?.includes('application/json')) {
      try {
        const jsonBody: unknown = JSON.parse(body);

        await AllureDecorators.attachJson(
          name,
          jsonBody
        );
      } catch {
        await AllureDecorators.attachText(
          name,
          body
        );
      }

      return;
    }

    await AllureDecorators.attachText(
      name,
      body
    );
  }

  /**
   * Прикрепление информации об окружении
   */
  static async attachEnvironmentInfo(): Promise<void> {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      CI: process.env.CI,
      BUILD_NUMBER: process.env.BUILD_NUMBER,
      BRANCH: process.env.BRANCH,
    };

    await AllureDecorators.attachJson(
      'Environment Info',
      envInfo
    );
  }
}

/**
 * Короткий алиас для AllureDecorators.
 */
export const Allure = AllureDecorators;
