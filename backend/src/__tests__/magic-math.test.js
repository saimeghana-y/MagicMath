const request = require('supertest');
const express = require('express');
const { calculateMagicMath } = require('../index');

describe('Magic Math Calculation', () => {
  test('should return 0 for input 0', () => {
    expect(calculateMagicMath(0)).toBe(0);
  });

  test('should return 1 for input 1', () => {
    expect(calculateMagicMath(1)).toBe(1);
  });

  test('should calculate correct value for input 2', () => {
    // magic_math(2) = magic_math(1) + magic_math(0) + 2
    // = 1 + 0 + 2 = 3
    expect(calculateMagicMath(2)).toBe(3);
  });

  test('should calculate correct value for input 3', () => {
    // magic_math(3) = magic_math(2) + magic_math(1) + 3
    // = 3 + 1 + 3 = 7
    expect(calculateMagicMath(3)).toBe(7);
  });

  test('should handle larger numbers efficiently', () => {
    const result = calculateMagicMath(10);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });
}); 