import { useCallback, useState } from 'react';
import { produce } from 'immer';
import type { MultiSelectOption, MultiSelectProps } from '../../src/components/MultiSelect/types';
import MultiSelect from '../../src/components/MultiSelect';

const generateOptions = (
    count: number,
    config?: { disabled?: number[]; checked?: number[] }
): Record<string, MultiSelectOption> => {
    return Array.from({ length: count }, (_, i) => {
        return `${i + 1}`;
    }).reduce(
        (acc, id) => {
            acc[id] = {
                label: `Option ${id}`,
                value: id,
                disabled: config?.disabled?.includes(+id),
                checked: config?.checked?.includes(+id),
            };
            return acc;
        },
        {} as Record<string, MultiSelectOption>
    );
};

const MOCK_SELECT_OPTIONS = generateOptions(2);

const MultiSelectWithState: React.FC<Partial<MultiSelectProps>> = (props) => {
    const [options, setOptions] = useState<MultiSelectProps['options']>(() => {
        return props?.options || MOCK_SELECT_OPTIONS;
    });

    const valueChangeHandler = useCallback(
        (value: MultiSelectOption) => {
            const isOptionChecked = value?.checked;
            setOptions((prev) => {
                return produce(prev, (draft) => {
                    draft[value.value] = {
                        ...draft[value.value],
                        checked: !isOptionChecked,
                    };
                });
            });
        },
        [setOptions]
    );

    return (
        <MultiSelect
            {...props}
            options={options}
            captionSingular={props?.captionSingular ?? 'item'}
            captionPlural={props?.captionPlural ?? 'items'}
            onValueChange={valueChangeHandler}
        />
    );
};

describe('MultiSelect:', () => {
    it('should render empty component without errors', () => {
        cy.mount(<MultiSelectWithState options={{}} />);
    });

    it('should render without value with options on options trigger click', () => {
        cy.mount(<MultiSelectWithState />);

        cy.get('[data-testid=multi-select-placeholder]').should('exist');

        cy.get('[data-testid=multi-select-trigger]').click();

        cy.get('[role=listbox]').should('exist');

        cy.get('[role="option"]').should('have.length', 2);
    });

    it('should render with initial value and it should be checked in options list', () => {
        cy.mount(<MultiSelectWithState options={generateOptions(2, { checked: [1] })} />);

        cy.get('[data-testid=multi-select-chip]').should('have.length', 1);
        cy.get('[data-testid=multi-select-chip]').contains('Option 1');

        cy.get('[data-testid=multi-select-trigger]').click();

        cy.get('[role=listbox]').should('exist');

        cy.get('[role="option"]').should('have.length', 2);

        cy.get('[role="option"][aria-checked="true"]').contains('Option 1');
    });
});
