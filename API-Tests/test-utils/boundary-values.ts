/**
 * Генерация граничных значений для тестирования
 */

export const generateBoundaryValues = (min: number, max: number): number[] => [
  min - 1, // just below min
  min,     // min boundary
  min + 1, // just above min
  max - 1, // just below max
  max,     // max boundary
  max + 1  // just above max
];

// Экспорт для удобства
export const boundaryValues = {
  generate: generateBoundaryValues,
};