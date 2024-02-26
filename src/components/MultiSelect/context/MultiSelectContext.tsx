import { createContext, useMemo } from 'react';
import type { WithChildren } from '@/types';
import type { MultiSelectProps } from '../types';
import { useSafeContext } from '../../../hooks/useSafeContext';

type MultiSelectContextState = Pick<MultiSelectProps, 'options' | 'onValueChange'>;

type MutiSelectProviderProps = WithChildren<MultiSelectContextState>;

const MultiSelectContext = createContext<MultiSelectContextState | undefined>(undefined);
MultiSelectContext.displayName = 'MultiSelectContext';

export const MultiSelectProvider = ({ children, options, onValueChange }: MutiSelectProviderProps) => {
    const memoizedValues = useMemo(() => {
        return { options, onValueChange };
    }, [onValueChange, options]);

    return <MultiSelectContext.Provider value={memoizedValues}>{children}</MultiSelectContext.Provider>;
};

export const useMultiSelectContext = () => {
    const context = useSafeContext(MultiSelectContext as React.Context<unknown>);

    return context as MultiSelectContextState;
};
