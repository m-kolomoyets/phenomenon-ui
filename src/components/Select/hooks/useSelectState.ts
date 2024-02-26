import { useMemo, useState } from 'react';
import type { SelectOption } from '../types';

export const useSelectState = (initialOptions: SelectOption[], initialValue?: SelectOption) => {
    const [value, setValue] = useState<SelectOption | undefined>(() => {
        return initialValue;
    });

    const optionsObject = useMemo(() => {
        return initialOptions.reduce(
            (acc, option) => {
                acc[option.value] = option;
                return acc;
            },
            {} as Record<string, SelectOption>
        );
    }, [initialOptions]);

    return {
        value,
        optionsObject,
        setValue,
    };
};
