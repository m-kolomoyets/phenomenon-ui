import { expect, it, describe } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks';
import type { MultiSelectOption } from '../types';
import { useMultiSelectState } from './useMultiSelectState';

const generateOptions = (count: number, config?: { checked?: string[] }): MultiSelectOption[] => {
    return Array.from({ length: count }, (_, i) => {
        const id = `${i + 1}`;

        return {
            label: `Option ${id}`,
            value: id,
            checked: config?.checked?.includes(id),
        };
    });
};

describe('useMultiSelectState()', () => {
    it('should return empty array as options if no initial options provided', () => {
        const { result } = renderHook(() => {
            return useMultiSelectState([]);
        });

        expect(result.current.options).toEqual({});
    });

    it('should return options with checked state', () => {
        const initialOptions = generateOptions(3, { checked: ['1'] });

        const { result } = renderHook(() => {
            return useMultiSelectState(initialOptions);
        });

        expect(result.current.options).toEqual({
            '1': { label: 'Option 1', value: '1', checked: true },
            '2': { label: 'Option 2', value: '2', checked: false },
            '3': { label: 'Option 3', value: '3', checked: false },
        });
    });

    it('should change the value', () => {
        const initialOptions = generateOptions(3);

        const { result } = renderHook(() => {
            return useMultiSelectState(initialOptions);
        });

        expect(result.current.options).toEqual({
            '1': { label: 'Option 1', value: '1', checked: false },
            '2': { label: 'Option 2', value: '2', checked: false },
            '3': { label: 'Option 3', value: '3', checked: false },
        });

        act(() => {
            result.current.onValueChange(result.current.options['2']);
        });

        expect(result.current.options['2'].checked).toEqual(true);
    });

    it('should toggle the value', () => {
        const initialOptions = generateOptions(3);

        const { result } = renderHook(() => {
            return useMultiSelectState(initialOptions);
        });

        expect(result.current.options).toEqual({
            '1': { label: 'Option 1', value: '1', checked: false },
            '2': { label: 'Option 2', value: '2', checked: false },
            '3': { label: 'Option 3', value: '3', checked: false },
        });

        act(() => {
            result.current.onValueChange(result.current.options['2']);
        });

        expect(result.current.options['2'].checked).toEqual(true);

        act(() => {
            result.current.onValueChange(result.current.options['2']);
        });

        expect(result.current.options['2'].checked).toEqual(false);
    });
});
