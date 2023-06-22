import type { UseSelectReturnValue } from 'downshift';
import type { WithClassName } from 'src/types';

export type DefaultSelectOptionType = {
    id: string;
    label: string;
};

export type SelectComponentsType<TOption> = {
    /**
        Function to render custom label;
    */
    renderLabel?: (labelProps?: ReturnType<UseSelectReturnValue<TOption>['getLabelProps']>) => JSX.Element;
    /**
        Function to render custom list item
    */
    renderItem?: (item: TOption) => JSX.Element;
};

export type SelectComponentsClassNamesType = {
    /**
        Class name for the select wrapper
    */
    wrapClassName?: string;
    /**
        Class name for inner container
    */
    innerClassName?: string;
    /**
        Class name for the select label
    */
    labelClassName?: string;
    /**
        Class name for the select input wrapper
    */
    inputWrapClassName?: string;
    /**
        Class name for the select input
    */
    inputClassName?: string;
    /**
        Class name for dropdown arrow indicator
    */
    toggleButtonClassName?: string;
    /**
        Class name for menu wrapper
    */
    menuClassName?: string;
};

export type SelectProps<TOption extends DefaultSelectOptionType> = WithClassName<{
    /**
        Label for the select;
        If false - label will not be rendered
    */
    label?: string;
    /**
        Options for the select
    */
    options: TOption[];
    /**
        Select Placeholder
    */
    inputPlaceholder?: string;
    /**
        Custom components for the select if needed
     */
    components?: SelectComponentsType<TOption>;
    /**
        Custom class names for the components;
        Will be applied to the custom components too, if they are provided
    */
    componentsClassNames?: SelectComponentsClassNamesType;
    /**
        If true - select will be searchable
    */
    isSearchable?: boolean;
    /**
        If true - select will be disabled
    */
    disabled?: boolean;
    /**
        If true - select will be with error state
    */
    isError?: boolean;
    /**
        Displayed error message
     */
    errorMessage?: string;
    /**
        Function to get label fom custom option type if needed
    */
    itemToString?: (item: TOption | null) => string;
    /**
        Selected Item change handler;
    */
    onChange?: (selectedItem?: TOption | null) => void;
    /**
        Select Search Input value change handler;
        Works ONLY if isSearchable = true
    */
    onInputValueChange?: (inputValue?: string) => void;
}>;
