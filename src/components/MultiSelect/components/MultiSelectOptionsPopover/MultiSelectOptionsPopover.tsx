import { memo, useRef } from 'react';
import {
    Root as PopoverRoot,
    Trigger as PopoverTrigger,
    Portal as PopoverPortal,
    Content as PopoverContent,
} from '@radix-ui/react-popover';
import { useVirtual } from 'react-virtual';
import clsx from 'clsx';
import type { MultiSelectOptionsPopoverProps } from './types';
import { useMultiSelectContext } from '../../context/MultiSelectContext';
import { useRerender } from '../../../../hooks/useRerender';
import { useToggle } from '../../../../hooks/useToggle';
import { Case, Default, Switch } from '../../../utils/Switch';
import Tooltip from '../Tooltip';
import s from './MultiSelectOptionsPopover.module.css';

const MultiSelectOptionsPopover: React.FC<MultiSelectOptionsPopoverProps> = ({ noOptionsMessage }) => {
    const { options, onValueChange } = useMultiSelectContext();

    const listRef = useRef<React.ElementRef<'ul'>>(null);

    const [isPopoverOpened, , setIsPopoverOpened] = useToggle();

    useRerender(isPopoverOpened);

    const totalRows = Object.keys(options).length;
    const virtualizer = useVirtual({
        size: totalRows,
        parentRef: listRef,
    });
    const { virtualItems } = virtualizer;

    return (
        <PopoverRoot open={isPopoverOpened} onOpenChange={setIsPopoverOpened} modal>
            <PopoverTrigger asChild>
                <button className={s.trigger} data-testid="multi-select-trigger">
                    <span>▼</span>
                </button>
            </PopoverTrigger>
            <PopoverPortal>
                <PopoverContent className={s.content} side="bottom" align="end">
                    <Switch>
                        <Case condition={!totalRows}>
                            <div className={s['empty-wrap']}>
                                <span>{noOptionsMessage}</span>
                            </div>
                        </Case>
                        <Default>
                            <ul
                                ref={listRef}
                                className={s.list}
                                role="listbox"
                                style={
                                    {
                                        height: virtualizer.totalSize,
                                    } as React.CSSProperties
                                }
                            >
                                {virtualItems.map((item) => {
                                    const option = Object.values(options)[item.index];
                                    const isOptionChecked = !!option?.checked;

                                    return (
                                        <li
                                            key={option.value}
                                            className={s['option-wrap']}
                                            role="option"
                                            aria-checked={isOptionChecked}
                                            ref={item.measureRef}
                                            style={
                                                {
                                                    transform: `translateY(${item.start}px)`,
                                                } as React.CSSProperties
                                            }
                                        >
                                            <span
                                                className={s.option}
                                                onClick={() => {
                                                    onValueChange(option);
                                                }}
                                            >
                                                {option.label}
                                                <Tooltip label={isOptionChecked ? 'Uncheck option' : 'Select option'}>
                                                    <button
                                                        className={clsx(s['option-cta'], 'focus-primary', {
                                                            [s.checked]: isOptionChecked,
                                                        })}
                                                        onClick={() => {
                                                            onValueChange(option);
                                                        }}
                                                    >
                                                        <span aria-hidden="true">{isOptionChecked ? '✅' : '➕'}</span>
                                                        <span className="sr-only">
                                                            {isOptionChecked ? 'Uncheck option' : 'Select option'}
                                                        </span>
                                                    </button>
                                                </Tooltip>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Default>
                    </Switch>
                </PopoverContent>
            </PopoverPortal>
        </PopoverRoot>
    );
};

export default memo(MultiSelectOptionsPopover);
