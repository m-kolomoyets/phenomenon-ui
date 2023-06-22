import { DefaultSelectOptionType } from '..';

export const itemToString = (item: DefaultSelectOptionType | null) => {
    return item ? item.label : '';
};
