import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVirtual } from 'react-virtual';
import { useCombobox } from 'downshift';
import clsx from 'clsx';
import type { DefaultSelectOptionType, SelectProps } from './types';
import { itemToString as defaultItemToString } from './utils/itemToString';
import './../../index.css';

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
            onInputValueChange,
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
            openMenu,
        } = useCombobox({
            items: filteredOptions,
            itemToString,
            onSelectedItemChange({ selectedItem }) {
                onChange?.(selectedItem);
            },
            onHighlightedIndexChange({ highlightedIndex: currentHighlightedIndex, type }) {
                if (
                    type !== useCombobox.stateChangeTypes.MenuMouseLeave &&
                    currentHighlightedIndex !== undefined &&
                    currentHighlightedIndex >= 0
                ) {
                    rowVirtualizer.scrollToIndex(currentHighlightedIndex);
                }
            },
        });

        const wrapClasses = useMemo(() => {
            return clsx('select-wrap', className, componentsClassNames?.wrapClassName);
        }, [className, componentsClassNames?.wrapClassName]);
        const innerClasses = useMemo(() => {
            return clsx('select-inner', componentsClassNames?.innerClassName);
        }, [componentsClassNames?.innerClassName]);
        const inputWrapperClasses = useMemo(() => {
            return clsx('select-input__wrapper', componentsClassNames?.inputWrapClassName);
        }, [componentsClassNames?.inputWrapClassName]);
        const inputClasses = useMemo(() => {
            return clsx('select-input', componentsClassNames?.inputClassName);
        }, [componentsClassNames?.inputClassName]);
        const toggleButtonClasses = useMemo(() => {
            return clsx('select-toggle__button', componentsClassNames?.toggleButtonClassName, {
                'select-toggle__button--opened': isOpen,
            });
        }, [componentsClassNames?.toggleButtonClassName, isOpen]);
        const menuClasses = useMemo(() => {
            return clsx('select-menu', componentsClassNames?.menuClassName);
        }, [componentsClassNames?.menuClassName]);
        const listItemClasses = useMemo(() => {
            return clsx('select-list__item', componentsClassNames?.listItemClassName);
        }, [componentsClassNames?.listItemClassName]);

        const labelJSX = useMemo(() => {
            const labelProps = getLabelProps({
                className: clsx('select-label', componentsClassNames?.labelClassName),
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
                return (
                    <span className="select-list__item--inner">
                        {!!components && !!components.renderItem ? (
                            components?.renderItem?.(item)
                        ) : (
                            <span>{item.label}</span>
                        )}
                    </span>
                );
            },
            [components]
        );

        useEffect(() => {
            if (!isOpen) {
                setSearchValue('');
            }
        }, [isOpen]);

        return (
            <div ref={ref} className={wrapClasses}>
                <div className={innerClasses}>
                    {labelJSX}
                    <div className={inputWrapperClasses}>
                        {isOpen ? (
                            <input
                                {...getInputProps({
                                    type: 'search',
                                    className: inputClasses,
                                    placeholder: inputPlaceholder,
                                })}
                                value={searchValue}
                                onChange={(event) => {
                                    const { value } = event.target;

                                    setSearchValue(value);
                                    onInputValueChange?.(value);
                                }}
                            />
                        ) : (
                            <button
                                className={clsx('select-value__container', inputClasses, {
                                    'no-value': !selectedItem,
                                })}
                                type="button"
                                onClick={openMenu}
                            >
                                <span>{selectedItem?.label ?? inputPlaceholder}</span>
                            </button>
                        )}

                        <button
                            {...getToggleButtonProps({
                                className: toggleButtonClasses,
                                type: 'button',
                                'aria-label': 'toggle menu',
                            })}
                        >
                            <span className="select-indicator" />
                        </button>
                    </div>
                    {isOpen ? (
                        <div className="select-menu__wrapper">
                            <ul
                                {...getMenuProps({
                                    className: menuClasses,
                                    style: {
                                        overflowY: 'auto',
                                        height: rowVirtualizer.totalSize,
                                    },
                                })}
                            >
                                {rowVirtualizer.virtualItems.map((virtualRow) => {
                                    return (
                                        <li
                                            ref={virtualRow.measureRef}
                                            {...getItemProps({
                                                className: clsx(listItemClasses, {
                                                    'select-list__item--highlighted':
                                                        highlightedIndex === virtualRow.index,
                                                }),
                                                index: virtualRow.index,
                                                key: virtualRow.index,
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
