import { expect, it, describe } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks';
import { useToggle } from './useToggle';

describe('useToggle()', () => {
    it('should return default "false" state if no initial value provided', () => {
        const { result } = renderHook(() => {
            return useToggle();
        });

        expect(result.current[0]).toBe(false);
    });

    it('should return default "true" state if initial value is "true"', () => {
        const { result } = renderHook(() => {
            return useToggle(true);
        });

        expect(result.current[0]).toBe(true);
    });

    it('should toggle state', () => {
        const { result } = renderHook(() => {
            return useToggle();
        });

        expect(result.current[0]).toBe(false);

        act(() => {
            result.current[1]();
        });

        expect(result.current[0]).toBe(true);
    });

    it('should set state', () => {
        const { result } = renderHook(() => {
            return useToggle();
        });

        expect(result.current[0]).toBe(false);

        act(() => {
            result.current[2](true);
        });

        expect(result.current[0]).toBe(true);
    });
});
