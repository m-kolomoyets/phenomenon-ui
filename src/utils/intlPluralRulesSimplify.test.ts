import { describe, it, expect } from 'vitest';
import { intlPluralRulesSimplify } from './intlPluralRulesSimplify';

describe('intlPluralRulesSimplify()', () => {
    it('should return plural when value [0, 1]', () => {
        expect(intlPluralRulesSimplify(0, 'singular', 'plural')).toBe('plural');
    });

    it('should return singular when value === 1', () => {
        expect(intlPluralRulesSimplify(1, 'singular', 'plural')).toBe('singular');
    });

    it('should return plural when value > 1', () => {
        expect(intlPluralRulesSimplify(2, 'singular', 'plural')).toBe('plural');
    });
});
