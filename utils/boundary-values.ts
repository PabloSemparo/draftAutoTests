// test-utils/boundary-values.ts
export const generateBoundaryValues = (min: number, max: number) => [
    min - 1, // just below min
    min,     // min boundary
    min + 1, // just above min
    max - 1, // just below max
    max,     // max boundary
    max + 1  // just above max
];