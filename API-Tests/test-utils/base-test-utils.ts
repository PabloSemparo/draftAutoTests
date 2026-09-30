/**
 * Базовые утилиты тестирования - централизованное хранилище для всех тест-утилит
 * 
 * Использование:
 * import { BaseTestUtils } from '../test-utils/base-test-utils';
 * 
 * Вместо дублирования логики в каждом файле test-utils.ts
 */

import { expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * Базовый класс для утилит тестирования
 * Предоставляет общие методы для всех тестов
 */
export class BaseTestUtils {
  /**
   * Настройка Allure метаданных для теста
   */
  static async setupAllure(
    epic: string,
    feature: string,
    story: string,
    severity: string = 'normal',
    tags: string[] = []
  ): Promise<void> {
    await allure.epic(epic);
    await allure.feature(feature);
    await allure.story(story);
    await allure.severity(severity as any);

    for (const tag of tags) {
      await allure.tag(tag);
    }
  }

  /**
   * Настройка родительского сьюта и подсьюта
   */
  static async setupParentSuite(suite: string, subSuite: string): Promise<void> {
    await allure.parentSuite('API Tests');
    await allure.suite(suite);
    await allure.subSuite(subSuite);
  }

  /**
   * Логирование шага в Allure отчете
   */
  static async logStep(name: string, action: () => Promise<void> | void): Promise<void> {
    await allure.step(name, action);
  }

  /**
   * Логирование параметров в Allure отчете
   */
  static async logParameters(parameters: Record<string, string | number | boolean>): Promise<void> {
    for (const [key, value] of Object.entries(parameters)) {
      await allure.parameter(key, String(value));
    }
  }

  /**
   * Логирование вложения в Allure отчете
   */
  static async logAttachment(
    name: string,
    content: string | object,
    type: string = 'application/json'
  ): Promise<void> {
    const contentString = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    await allure.attachment(name, contentString, type);
  }

  /**
   * Валидация времени ответа
   * @returns Время выполнения в миллисекундах
   */
  static async validateResponseTime(
    startTime: number,
    maxTime: number
  ): Promise<number> {
    const responseTime = Date.now() - startTime;
    expect(
      responseTime,
      `Время ответа должно быть меньше ${maxTime}ms. Фактически: ${responseTime}ms`
    ).toBeLessThan(maxTime);

    await this.logAttachment('Response Time', `Response time: ${responseTime}ms`, 'text/plain');
    return responseTime;
  }

  /**
   * Валидация статус кода ответа
   */
  static validateStatusCode(actualCode: number, expectedCode: number): void {
    expect(actualCode, `Статус код должен быть ${expectedCode}`).toBe(expectedCode);
  }

  /**
   * Валидация ожидаемых статус кодов
   */
  static async validateExpectedStatusCodes(
    actualCode: number,
    expectedCodes: number[]
  ): Promise<number> {
    expect(actualCode, 'Статус код должен быть определен').toBeDefined();
    expect(typeof actualCode, 'Статус код должен быть числом').toBe('number');
    expect(
      expectedCodes,
      `Статус код должен быть одним из: ${expectedCodes.join(', ')}`
    ).toContain(actualCode);

    await this.logParameters({ 'Actual Status Code': actualCode.toString() });
    return actualCode;
  }

  /**
   * Валидация поля даты
   */
  static validateDateField(dateString: string): void {
    const date = new Date(dateString);
    expect(isNaN(date.getTime()), 'Дата должна быть валидной').toBe(false);
  }

  /**
   * Валидация строкового поля
   */
  static validateStringField(value: unknown, fieldName: string): void {
    expect(typeof value, `${fieldName} должен быть строкой`).toBe('string');
  }

  /**
   * Валидация числового поля
   */
  static validateNumberField(value: unknown, fieldName: string): void {
    expect(typeof value, `${fieldName} должен быть числом`).toBe('number');
  }

  /**
   * Валидация массива
   */
  static validateArrayField(value: unknown, fieldName: string): void {
    expect(Array.isArray(value), `${fieldName} должен быть массивом`).toBe(true);
  }

  /**
   * Завершение теста с логированием
   */
  static async finalizeTest(
    success: boolean = true,
    message?: string
  ): Promise<void> {
    await this.logStep('Завершение теста', async () => {
      const status = success ? 'ПРОЙДЕН' : 'ПРОВАЛЕН';
      await this.logAttachment(
        'Test Status',
        `Тест ${status}${message ? `: ${message}` : ''}`,
        'text/plain'
      );

      if (success) {
        console.log(`✅ Тест успешно завершен${message ? `: ${message}` : ''}`);
      } else {
        console.log(`❌ Тест завершен с ошибкой${message ? `: ${message}` : ''}`);
      }
    });
  }

  /**
   * Очистка после теста
   */
  static async cleanupTest(): Promise<void> {
    await this.logStep('Очистка после теста', async () => {
      await this.logAttachment('Cleanup', 'Ресурсы освобождены', 'text/plain');
    });
  }

  /**
   * Валидация структуры ошибки
   */
  static validateErrorStructure(
    error: Record<string, unknown>,
    expectedKey?: string,
    expectedCode?: string
  ): void {
    expect(error, 'Ошибка должна содержать key, code и description').toHaveProperty('key');
    expect(error).toHaveProperty('code');
    expect(error).toHaveProperty('description');

    if (expectedKey) {
      expect(error.key, `Ключ ошибки должен быть "${expectedKey}"`).toBe(expectedKey);
    }

    if (expectedCode) {
      expect(error.code, `Код ошибки должен быть "${expectedCode}"`).toBe(expectedCode);
    }
  }

  /**
   * Валидация структуры ответа пакета
   */
  static validatePackageResponseStructure(responseBody: Record<string, unknown>): void {
    expect(responseBody, 'Ответ должен содержать все обязательные поля').toHaveProperty('id');
    expect(responseBody).toHaveProperty('number');
    expect(responseBody).toHaveProperty('typeId');
    expect(responseBody).toHaveProperty('statusCode');
    expect(responseBody).toHaveProperty('createdAt');
    expect(responseBody).toHaveProperty('responsibleLawyerId');
    expect(responseBody).toHaveProperty('includedContracts');

    // Проверка типов данных
    expect(typeof responseBody.id, 'ID должен быть строкой').toBe('string');
    expect(typeof responseBody.number, 'Number должен быть числом').toBe('number');
    expect(typeof responseBody.typeId, 'TypeId должен быть строкой').toBe('string');
    expect(typeof responseBody.statusCode, 'StatusCode должен быть строкой').toBe('string');
    expect(typeof responseBody.createdAt, 'CreatedAt должен быть строкой').toBe('string');
    expect(
      typeof responseBody.responsibleLawyerId,
      'ResponsibleLawyerId должен быть строкой или null'
    ).toBe('string');
    expect(
      Array.isArray(responseBody.includedContracts),
      'IncludedContracts должен быть массивом'
    ).toBe(true);

    // Валидация поля ответственного юриста
    this.validateResponsibleLawyerId(responseBody.responsibleLawyerId);
  }

  /**
   * Валидация поля ответственного юриста
   */
  static validateResponsibleLawyerId(lawyerId: string | null): void {
    const isValid = typeof lawyerId === 'string' ? lawyerId.length > 0 : lawyerId === null;
    expect(
      isValid,
      'ResponsibleLawyerId должен быть непустой строкой или null'
    ).toBe(true);
  }

  /**
   * Валидация content-type заголовка
   */
  static validateContentType(headers: Record<string, string>): void {
    const contentType = headers['content-type'];
    expect(contentType, 'Content-Type должен быть application/json').toContain('application/json');
  }
}

/**
 * Утилиты для кастомных матчеров
 */
export class CustomMatchers {
  /**
   * Проверка, что значение является объектом
   */
  static assertIsObject(value: unknown, message?: string): void {
    expect(value, message).toBeDefined();
    expect(typeof value, message).toBe('object');
    expect(value, message).not.toBeNull();
  }

  /**
   * Проверка, что значение является строкой или null
   */
  static assertIsStringOrNull(value: unknown, message?: string): void {
    if (value !== null) {
      expect(typeof value, message).toBe('string');
      expect((value as string).length, message).toBeGreaterThan(0);
    }
  }

  /**
   * Проверка, что значение является валидной датой
   */
  static assertIsValidDate(dateString: string, message?: string): void {
    const date = new Date(dateString);
    expect(isNaN(date.getTime()), message).toBe(false);
  }
}