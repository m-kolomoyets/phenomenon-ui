import type { PopoverProps as RadixPopoverProps } from '@radix-ui/react-popover';
import type { WithClassName } from '@/types';

export type MultiSelectOption = {
    /**
        Label of the option.
    */
    label: string;
    /**
        Identifier of the option.
    */
    value: string;
    /**
        If true, the option is disabled.
    */
    disabled?: boolean;
    /**
        If true, the option is checked.
    */
    checked?: boolean;
};

export type MultiSelectProps = WithClassName<{
    /**
        Options list to select from.
    */
    options: Record<string, MultiSelectOption>;
    /**
        Placeholder for the select.
    */
    captionSingular: string;
    /**
        Placeholder for the select.
    */
    captionPlural: string;
    /**
        If true, the select is disabled.
    */
    disabled?: boolean;
    /**
        Callback function for changing value of the select.
    */
    onValueChange: (value: MultiSelectOption) => void;
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
    /**
        If true, selecting the same option will uncheck it.
    */
    isWithChips?: boolean;
}> &
    RadixPopoverProps;
