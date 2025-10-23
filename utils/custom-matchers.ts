import { expect } from '@playwright/test';

// Кастомные хелперы вместо несуществующих матчеров
export const assertIsObject = (value: any, message?: string) => {
    expect(value, message).toBeDefined();
    expect(typeof value, message).toBe('object');
    expect(value, message).not.toBeNull();
};

export const assertIsStringOrNull = (value: any, message?: string) => {
    if (value !== null) {
        expect(typeof value, message).toBe('string');
        expect(value.length, message).toBeGreaterThan(0);
    }
};

export const assertIsValidDate = (dateString: string, message?: string) => {
    const date = new Date(dateString);
    expect(isNaN(date.getTime()), message).toBe(false);
};