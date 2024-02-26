import { useCallback, useState } from 'react';
import { produce } from 'immer';
import type { MultiSelectOption } from '../types';

export const useMultiSelectState = (initialOptions: MultiSelectOption[], initialValues?: string[]) => {
    const [options, setOptions] = useState(() => {
        return initialOptions.reduce(
            (acc, option) => {
                acc[option.value] = {
                    ...option,
                    checked: initialValues?.length ? initialValues?.includes(option.value) : !!option?.checked,
                };

                return acc;
            },
            {} as Record<string, MultiSelectOption>
        );
    });

    const onValueChange = useCallback((value: MultiSelectOption) => {
        const isOptionChecked = value?.checked;

        setOptions((prev) => {
            return produce(prev, (draft) => {
                draft[value.value] = {
                    ...draft[value.value],
                    checked: !isOptionChecked,
                };
            });
        });
    }, []);

    return {
        options,
        onValueChange,
    };
};
