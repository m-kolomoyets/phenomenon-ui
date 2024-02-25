import type { SelectProps as SelectRootProps } from '@radix-ui/react-select';

export type SelectOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

export type SelectProps = {
    /**
        Selected value.
    */
    value?: SelectOption;
    /**
        Default value.
    */
    defaultValue?: SelectOption;
    /**
        Options list to select from.
     */
    options: Record<string, SelectOption>;
    /**
        Placeholder for the select.
    */
    placeholder?: string;
    /**
        Callback function for changing value of the select.
    */
    onChange: (value?: SelectOption) => void;
    /**
        If true, the select is disabled.
    */
    disabled?: boolean;
    /**
        An error message of the select.
    */
    errorMessage?: string;
    /**
        No options message.
    */
    noOptionsMessage?: string;
    /**
        If true, selecting the same option will uncheck it.
    */
    isCleanable?: boolean;
} & Omit<SelectRootProps, 'value' | 'defaultValue'>;
