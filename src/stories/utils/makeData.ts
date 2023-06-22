import { faker } from '@faker-js/faker';
import type { DefaultSelectOptionType } from 'phenomenon-ui';

export const createSelectOptionsWithDefaultType = (count: number): DefaultSelectOptionType[] => {
    return new Array(count).fill(null).map((_, index) => {
        return {
            label: faker.company.name(),
            id: index.toString(),
        } as DefaultSelectOptionType;
    });
};
