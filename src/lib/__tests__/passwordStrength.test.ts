import { getPasswordStrength } from '../passwordStrength';

describe('getPasswordStrength', () => {
    it('classifies Weak for short/simple passwords', () => {
        expect(getPasswordStrength('')).toEqual({ level: 'Weak', score: 0 });
        expect(getPasswordStrength('abc123').level).toBe('Weak');
        expect(getPasswordStrength('Abcdefgh123').level).toBe('Weak'); // 11 chars -> still weak
    });

    it('classifies Medium for >=12 chars with at least two criteria', () => {
        expect(getPasswordStrength('abcdefghijkl12').level).toBe('Medium'); // lower+digits >= 12
        expect(getPasswordStrength('AAAAAAAAAAAA!!').level).toBe('Medium'); // upper+symbols >= 12
    });

    it('classifies Strong for >=15 chars with all criteria', () => {
        expect(getPasswordStrength('Abc@123defGhijk').level).toBe('Strong');
    });
});
