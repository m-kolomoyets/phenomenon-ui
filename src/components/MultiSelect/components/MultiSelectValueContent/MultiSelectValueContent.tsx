import { memo, useMemo, useRef, useState } from 'react';
import {
    Root as PopoverRoot,
    Trigger as PopoverTrigger,
    Portal as PopoverPortal,
    Content as PopoverContent,
} from '@radix-ui/react-popover';
import clsx from 'clsx';
import type { MultiSelectValueContentProps } from './types';
import { useMultiSelectContext } from '../../context/MultiSelectContext';
import { useToggle } from '../../../../hooks/useToggle';
import { intlPluralRulesSimplify } from '../../../../utils/intlPluralRulesSimplify';
import { useResizeObserver } from '../../../../hooks/useResizeObserver';
import { Case, Default, Switch } from '../../../utils/Switch';
import Tooltip from '../Tooltip';
import s from './MultiSelectValueContent.module.css';

const MultiSelectValueContent: React.FC<MultiSelectValueContentProps> = ({
    captionSingular,
    captionPlural,
    isWithChips,
}) => {
    const { options, onValueChange } = useMultiSelectContext();

    const wrapRef = useRef<React.ElementRef<'div'>>(null);
    const chipRef = useRef<React.ElementRef<'button'>>(null);
    const chipsWidthsConfigRef = useRef<Record<string, number>>({});
    const totalChipsWidthRef = useRef(0);

    const checkedOptions = useMemo(() => {
        return Object.values(options).filter((option) => {
            return option.checked;
        });
    }, [options]);

    const [isDisabled, , setIsDisabled] = useToggle(true);
    const [chipsAmountToDisplay, setChipsAmountToDisplay] = useState(checkedOptions.length);
    const extraValuesAmount = Math.max(checkedOptions.length - chipsAmountToDisplay, 0);

    useResizeObserver(wrapRef, (entry) => {
        if (!isWithChips) {
            setIsDisabled(false);
            return;
        }

        const { width: wrapWidth } = entry.contentRect;
        let chipWidth = chipRef.current?.offsetWidth ?? 0;

        if (chipRef.current) {
            const chipStyles = getComputedStyle(chipRef.current);
            chipWidth += parseInt(chipStyles.marginLeft) + parseInt(chipStyles.marginRight);
        }

        const availableWidth = Math.floor(wrapWidth - chipWidth);
        const chipsWidths = Object.values(chipsWidthsConfigRef.current);
        const filteredChipsWidths = chipsWidths.filter((chipWidth) => {
            return chipWidth <= availableWidth;
        });
        const checkedFilteredChipsWidths = filteredChipsWidths.length ? filteredChipsWidths : [chipsWidths[0]];
        const closestChipWidth = Math.max(...checkedFilteredChipsWidths);
        const chipWithIndex = chipsWidths.indexOf(closestChipWidth);

        setChipsAmountToDisplay(chipWithIndex + 1);
        setIsDisabled(false);
    });

    return (
        <div className={s.wrap} ref={wrapRef}>
            <span
                className={clsx(s['chips-wrap'], {
                    [s.disabled]: isDisabled,
                })}
            >
                <Switch>
                    <Case condition={!checkedOptions.length}>
                        <span className={s.placeholder} data-testid="multi-select-placeholder">
                            Select {captionPlural}
                        </span>
                    </Case>
                    <Case condition={!isWithChips}>
                        <span>
                            {checkedOptions.length}{' '}
                            {intlPluralRulesSimplify(checkedOptions.length, captionSingular, captionPlural)}
                        </span>
                    </Case>
                    <Default>
                        {checkedOptions.slice(0, chipsAmountToDisplay).map((chip) => {
                            return (
                                <span
                                    key={chip.value}
                                    data-testid="multi-select-chip"
                                    aria-label={chip.label}
                                    ref={(node) => {
                                        if (!node || chipsWidthsConfigRef.current[chip.value]) {
                                            return;
                                        }

                                        const nodeStyles = getComputedStyle(node);

                                        totalChipsWidthRef.current +=
                                            node.offsetWidth +
                                            parseInt(nodeStyles.marginLeft) +
                                            parseInt(nodeStyles.marginRight);

                                        chipsWidthsConfigRef.current[chip.value] = totalChipsWidthRef.current;
                                    }}
                                    className={clsx(s.chip, 'truncate')}
                                >
                                    {chip.label}
                                    <Tooltip label="Remove option">
                                        <button
                                            className={clsx(s['chip-remove-button'], 'focus-primary')}
                                            onClick={() => {
                                                onValueChange(chip);
                                            }}
                                        >
                                            <span aria-hidden="true">❌</span>
                                            <span className="sr-only">Remove option</span>
                                        </button>
                                    </Tooltip>
                                </span>
                            );
                        })}
                    </Default>
                </Switch>
            </span>
            {checkedOptions.length && isWithChips && extraValuesAmount ? (
                <PopoverRoot modal>
                    <Tooltip label="View all selected options">
                        <PopoverTrigger disabled={isDisabled} asChild>
                            <button ref={chipRef} className={clsx(s['extra-values-chip'], 'focus-primary')}>
                                +{extraValuesAmount}
                            </button>
                        </PopoverTrigger>
                    </Tooltip>
                    <PopoverPortal>
                        <PopoverContent className={s['extra-popover-content']} sideOffset={4}>
                            <ul className={s['extra-list']}>
                                {checkedOptions.map((option) => {
                                    return (
                                        <li key={option.value} className={s['extra-item']}>
                                            <span
                                                className={s['extra-chip']}
                                                onClick={() => {
                                                    onValueChange(option);
                                                }}
                                            >
                                                {option.label}
                                                <Tooltip label="Remove option">
                                                    <button
                                                        className={clsx(s['chip-remove-button'], 'focus-primary')}
                                                        onClick={() => {
                                                            onValueChange(option);
                                                        }}
                                                    >
                                                        <span aria-hidden="true">❌</span>
                                                        <span className="sr-only">Remove option</span>
                                                    </button>
                                                </Tooltip>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </PopoverContent>
                    </PopoverPortal>
                </PopoverRoot>
            ) : null}
        </div>
    );
};

export default memo(MultiSelectValueContent);
