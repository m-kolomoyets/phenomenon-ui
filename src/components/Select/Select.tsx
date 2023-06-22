import { forwardRef, memo, useCallback, useMemo, useRef, useState } from 'react';
import { useVirtual } from 'react-virtual';
import { useCombobox } from 'downshift';
import clsx from 'clsx';
import type { DefaultSelectOptionType, SelectProps } from './types';
import { itemToString as defaultItemToString } from './utils/itemToString';
import s from './Select.module.css';

const Select = forwardRef(
    <TOption extends DefaultSelectOptionType>(props: SelectProps<TOption>, ref?: React.Ref<HTMLDivElement>) => {
        const {
            className,
            options,
            label,
            inputPlaceholder = 'Select...',
            components,
            componentsClassNames,
            itemToString = defaultItemToString,
            onChange,
            // onInputValueChange,
        } = props;

        const [searchValue, setSearchValue] = useState('');
        const listRef = useRef<HTMLUListElement>(null);

        const filteredOptions = useMemo(() => {
            return options.filter((option) => {
                return itemToString(option).toLowerCase().includes(searchValue.trim().toLowerCase());
            });
        }, [itemToString, options, searchValue]);

        const rowVirtualizer = useVirtual({
            size: filteredOptions.length,
            parentRef: listRef,
            overscan: filteredOptions.length,
        });
        const {
            isOpen,
            selectedItem,
            highlightedIndex,
            getLabelProps,
            getInputProps,
            getToggleButtonProps,
            getMenuProps,
            getItemProps,
        } = useCombobox({
            items: filteredOptions,
            isOpen: true,
            itemToString,
            onSelectedItemChange: ({ selectedItem }) => {
                onChange?.(selectedItem);
            },
            onInputValueChange: ({ inputValue }) => {
                setSearchValue(inputValue ?? '');
            },
            onHighlightedIndexChange: ({ highlightedIndex: currentHighlightedIndex, type }) => {
                if (type !== useCombobox.stateChangeTypes.MenuMouseLeave) {
                    rowVirtualizer.scrollToIndex(currentHighlightedIndex ?? highlightedIndex);
                }
            },
            scrollIntoView: () => {
                return;
            },
        });

        const wrapClasses = useMemo(() => {
            return clsx(s.wrap, className, componentsClassNames?.wrapClassName);
        }, [className, componentsClassNames?.wrapClassName]);
        const innerClasses = useMemo(() => {
            return clsx(s.inner, componentsClassNames?.innerClassName);
        }, [componentsClassNames?.innerClassName]);
        const inputWrapperClasses = useMemo(() => {
            return clsx(s.inputWrapper, componentsClassNames?.inputWrapClassName);
        }, [componentsClassNames?.inputWrapClassName]);
        const inputClasses = useMemo(() => {
            return clsx(s.input, componentsClassNames?.inputClassName);
        }, [componentsClassNames?.inputClassName]);
        const toggleButtonClasses = useMemo(() => {
            return clsx(s.toggleButton, componentsClassNames?.toggleButtonClassName, {
                [s.opened]: isOpen,
            });
        }, [componentsClassNames?.toggleButtonClassName, isOpen]);
        const menuClasses = useMemo(() => {
            return clsx(s.menu, componentsClassNames?.menuClassName);
        }, [componentsClassNames?.menuClassName]);

        const labelJSX = useMemo(() => {
            const labelProps = getLabelProps({
                className: clsx(s.label, componentsClassNames?.labelClassName),
            });

            switch (true) {
                case !label: {
                    return null;
                }
                case !!components && !!components.renderLabel: {
                    return components?.renderLabel?.(labelProps);
                }
                default: {
                    return <label {...labelProps}>{label}</label>;
                }
            }
        }, [components, componentsClassNames?.labelClassName, getLabelProps, label]);

        const renderItemJSX = useCallback(
            (item: TOption) => {
                switch (true) {
                    case !!components && !!components.renderItem: {
                        return components?.renderItem?.(item);
                    }
                    default: {
                        return <span>{item.label}</span>;
                    }
                }
            },
            [components]
        );

        return (
            <div ref={ref} className={wrapClasses}>
                <div className={innerClasses}>
                    {labelJSX}
                    <div className={inputWrapperClasses}>
                        <input
                            {...getInputProps({
                                type: 'search',
                                className: inputClasses,
                                placeholder: inputPlaceholder,
                            })}
                        />
                        <button
                            {...getToggleButtonProps({
                                className: toggleButtonClasses,
                                type: 'button',
                                'aria-label': 'toggle menu',
                            })}
                        >
                            <span className={s.indicator} />
                        </button>
                    </div>
                    {isOpen ? (
                        <div
                            style={{
                                maxHeight: '200px',
                            }}
                        >
                            <ul
                                {...getMenuProps({
                                    className: menuClasses,
                                    style: {
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        height: rowVirtualizer.totalSize,
                                    },
                                })}
                            >
                                {rowVirtualizer.virtualItems.map((virtualRow) => {
                                    return (
                                        <li
                                            {...getItemProps({
                                                ref: virtualRow.measureRef,
                                                index: virtualRow.index,
                                                key: virtualRow.index,
                                                style: {
                                                    height: virtualRow.size,
                                                },
                                                item: filteredOptions[virtualRow.index],
                                            })}
                                        >
                                            {renderItemJSX(filteredOptions[virtualRow.index])}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
);

Select.displayName = 'Select';

export default memo(Select);
