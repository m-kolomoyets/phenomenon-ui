import { memo } from 'react';
import type { MultiSelectProps } from './types';
import { MultiSelectProvider } from './context/MultiSelectContext';
import MultiSelectOptionsPopover from './components/MultiSelectOptionsPopover';
import MultiSelectValueContent from './components/MultiSelectValueContent';
import s from './MultiSelect.module.css';

const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    captionPlural,
    captionSingular,
    isWithChips = true,
    noOptionsMessage = 'No options',
    onValueChange,
}) => {
    return (
        <MultiSelectProvider options={options} onValueChange={onValueChange}>
            <div className={s.wrap}>
                <MultiSelectValueContent
                    captionSingular={captionSingular}
                    captionPlural={captionPlural}
                    isWithChips={isWithChips}
                />
                <MultiSelectOptionsPopover noOptionsMessage={noOptionsMessage} />
            </div>
        </MultiSelectProvider>
    );
};

export default memo(MultiSelect);
