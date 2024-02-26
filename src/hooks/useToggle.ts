import { useCallback, useState } from 'react';
import type { SetStateValue } from '@/types';

export const useToggle = (defaultValue?: boolean): [boolean, () => void, SetStateValue<boolean>] => {
    const [value, setValue] = useState(Boolean(defaultValue));

    const toggle = useCallback(() => {
        setValue((value) => {
            return !value;
        });
    }, []);

    return [value, toggle, setValue];
};
