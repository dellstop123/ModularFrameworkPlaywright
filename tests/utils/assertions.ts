import { expect } from '@playwright/test';

/**
 * Asserts that every object in the array has a property with the expected value.
 * @param arr Array of objects to check
 * @param property Property name to check
 * @param value Expected value
 */
export function expectAllToHaveProperty<T>(arr: T[], property: keyof T, value: any) {
  arr.forEach((item, idx) => {
    expect(item[property], `Item at index ${idx} should have ${String(property)} === ${value}`).toBe(value);
  });
} 