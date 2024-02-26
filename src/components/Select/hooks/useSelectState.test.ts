import { expect, it, describe } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks';
import type { SelectOption } from '../types';
import { useSelectState } from './useSelectState';

const generateOptions = (count: number): SelectOption[] => {
    return Array.from({ length: count }, (_, i) => {
        return {
            label: `Option ${i + 1}`,
            value: `${i + 1}`,
        };
    });
};

describe('useSelectState()', () => {
    it('should return empty object as optionsObject if no initial options provided', () => {
        const { result } = renderHook(() => {
            return useSelectState([]);
        });

        expect(result.current.optionsObject).toEqual({});
        expect(result.current.value).toBeUndefined();
    });

    it('should return optionsObject with options', () => {
        const initialOptions = generateOptions(3);

        const { result } = renderHook(() => {
            return useSelectState(initialOptions);
        });

        expect(result.current.optionsObject).toEqual({
            1: { label: 'Option 1', value: '1' },
            2: { label: 'Option 2', value: '2' },
            3: { label: 'Option 3', value: '3' },
        });
    });

    it('should return initial value', () => {
        const initialOptions = generateOptions(3);

        const { result } = renderHook(() => {
            return useSelectState(initialOptions, initialOptions[1]);
        });

        expect(result.current.value?.value).toBe('2');
    });

    it('should change the value if no initial value provided', () => {
        const initialOptions = generateOptions(3);

        const { result } = renderHook(() => {
            return useSelectState(initialOptions);
        });

        act(() => {
            result.current.setValue(initialOptions[1]);
        });

        expect(result.current.value?.value).toBe('2');
    });

    it('should change value if initial value provided', () => {
        const initialOptions = generateOptions(3);

        const { result } = renderHook(() => {
            return useSelectState(initialOptions, initialOptions[0]);
        });

        act(() => {
            result.current.setValue(initialOptions[1]);
        });

        expect(result.current.value?.value).toBe('2');
    });
});
