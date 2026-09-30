/**
 * Конфигурация Allure для API тестов
 * Централизованное управление настройками отчетов
 */

import { AllureDecorators } from './allure-decorators';
import { AllureHelpers } from './allure-helpers';

/**
 * Класс для удобного управления Allure отчетами
 */
export class AllureConfig {
  /**
   * Настройка контекста теста для Allure
   */
  static setupTestContext(
    epic: string,
    feature: string,
    story: string,
    severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial' = 'normal',
    tags: string[] = []
  ) {
    AllureDecorators.epic(epic);
    AllureDecorators.feature(feature);
    AllureDecorators.story(story);
    AllureDecorators.severity(severity);

    for (const tag of tags) {
      AllureDecorators.tag(tag);
    }
  }

  /**
   * Прикрепление ответа API к отчету
   */
  static async attachApiResponse(
    response: any,
    name: string = 'API Response'
  ): Promise<void> {
    await AllureHelpers.attachApiResponse(response, name);
  }

  /**
   * Прикрепление информации о окружении
   */
  static attachEnvironmentInfo(): void {
    AllureHelpers.attachEnvironmentInfo();
  }

  /**
   * Запуск теста с именем и описанием
   */
  static startTest(name: string, description?: string): void {
    AllureHelpers.startTest(name, description);
  }

  /**
   * Прикрепление JSON данных
   */
  static attachJson(name: string, data: unknown): void {
    AllureDecorators.attachJson(name, data);
  }

  /**
   * Прикрепление текстового файла
   */
  static attachText(name: string, text: string): void {
    AllureDecorators.attachText(name, text);
  }

  /**
   * Создание шага в Allure
   */
  static async step<T>(name: string, body: () => Promise<T> | T): Promise<T> {
    if (body.constructor.name === 'AsyncFunction') {
      return await AllureDecorators.step(name, body as () => Promise<T>);
    } else {
      return AllureDecorators.stepSync(name, body as () => T);
    }
  }
}

// Экспорт декораторов для прямого использования
export { AllureDecorators, AllureHelpers };