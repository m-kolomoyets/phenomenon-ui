import type { SelectOption, SelectProps } from '../../src/components/Select/types';
import { useSelectState } from '../../src/components/Select/hooks/useSelectState';
import Select from '../../src/components/Select';

const generateOptions = (count: number, disabledOptionsNumbers?: number[]): SelectOption[] => {
    return Array.from({ length: count }, (_, i) => {
        return {
            label: `Option ${i + 1}`,
            value: `${i + 1}`,
            disabled: disabledOptionsNumbers?.includes(i + 1),
        };
    });
};

const MOCK_SELECT_OPTIONS = generateOptions(2);

type SelectWithStateProps = Partial<Omit<SelectProps, 'options'>> & {
    options?: SelectOption[];
};

const SelectWithState: React.FC<SelectWithStateProps> = (props) => {
    const { value, optionsObject, setValue } = useSelectState(props?.options ?? MOCK_SELECT_OPTIONS, props?.value);

    return <Select {...props} options={optionsObject} placeholder="Select option" value={value} onChange={setValue} />;
};

describe('Select:', () => {
    it('should render empty component without errors', () => {
        cy.mount(<SelectWithState options={[]} />);
    });

    it('Should render without value with options on trigger click', () => {
        cy.mount(<SelectWithState placeholder="Select option" />);

        cy.get('[data-testid=select-trigger]').click();

        cy.get('[role=listbox]').should('exist');

        cy.get('[role="option"]').should('have.length', 2);
    });

    it('Should render with initial value and it should be checked in options list', () => {
        cy.mount(<SelectWithState value={MOCK_SELECT_OPTIONS[0]} />);

        cy.get('[data-testid=select-trigger]').contains('Option 1');

        cy.get('[data-testid=select-trigger]').click();

        cy.get('[role=listbox]').should('exist');

        cy.get('[role="option"]').should('have.length', 2);

        cy.get('[role="option"][data-state="checked"]').contains('Option 1');
    });

    it('should change value on option click and close options list', () => {
        cy.mount(<SelectWithState />);

        cy.get('[data-testid=select-trigger]').click();

        cy.get('[role="option"]').contains('Option 2').click();

        cy.get('[data-testid=select-trigger]').contains('Option 2');

        cy.get('[role=listbox]').should('not.exist');
    });

    it('should render scrollable content', () => {
        cy.mount(<SelectWithState options={generateOptions(1000)} />);

        cy.get('[data-testid=select-trigger]').click();

        cy.get('[role=listbox]').should('exist');

        cy.get('[role="option"]').should('have.length', 1000);
    });

    describe('Empty message:', () => {
        it('should render default empty message when no options passed and noOptionsMessage prop is not passed', () => {
            cy.mount(<SelectWithState options={[]} />);

            cy.get('[data-testid=select-trigger]').click();

            cy.get('[role=listbox]').should('exist');

            cy.get('[role="option"]').should('not.exist');

            cy.get('[role="status"]').contains('No options');
        });

        it('should render custom "No options" message when no options passed and noOptionsMessage prop is passed', () => {
            cy.mount(<SelectWithState options={[]} noOptionsMessage="No options available" />);

            cy.get('[data-testid=select-trigger]').click();

            cy.get('[role=listbox]').should('exist');

            cy.get('[role="option"]').should('not.exist');

            cy.get('[role="status"]').contains('No options available');
        });
    });

    describe('Clearable:', () => {
        it('should render clear button when isCleanable prop is passed and value is selected', () => {
            cy.mount(<SelectWithState isCleanable />);

            cy.get('[data-testid="select-clear"]').should('not.exist');

            cy.mount(<SelectWithState value={MOCK_SELECT_OPTIONS[0]} isCleanable />);

            cy.get('[data-testid=select-trigger]').contains('Option 1');

            cy.get('[data-testid="select-clear"]').should('exist');
        });

        it('should clear value on clear button click', () => {
            cy.mount(<SelectWithState value={MOCK_SELECT_OPTIONS[0]} isCleanable />);

            cy.get('[data-testid=select-trigger]').contains('Option 1');

            cy.get('[data-testid="select-clear"]').should('exist');

            cy.get('[data-testid="select-clear"]').click();

            cy.get('[data-testid=select-trigger]').contains('Select option');
        });
    });

    describe('Select id disabled:', () => {
        it('should be non interactive when disabled prop is passed', () => {
            cy.mount(<SelectWithState disabled />);

            cy.get('[data-testid=select-trigger]').should('be.disabled');
        });

        describe('When isClearable prop is passed:', () => {
            it('should be non interactive when disabled prop is passed and clearable', () => {
                cy.mount(<SelectWithState disabled value={MOCK_SELECT_OPTIONS[0]} isCleanable />);

                cy.get('[data-testid=select-trigger]').should('be.disabled');

                cy.get('[data-testid="select-clear"]').should('not.exist');
            });
        });
    });

    describe('Option is disabled', () => {
        it('should display disabled option with "disabled" attribute', () => {
            cy.mount(<SelectWithState options={generateOptions(2, [1])} value={MOCK_SELECT_OPTIONS[0]} />);

            cy.get('[data-testid=select-trigger]').contains('Option 1');

            cy.get('[data-testid=select-trigger]').click();

            cy.get('[role="option"][data-disabled]').contains('Option 1');
        });

        it('should not change value on disabled option click', () => {
            cy.mount(<SelectWithState options={generateOptions(4, [2])} value={MOCK_SELECT_OPTIONS[0]} />);

            cy.get('[data-testid=select-trigger]').contains('Option 1');

            cy.get('[data-testid=select-trigger]').click();

            cy.get('[role="option"][data-disabled]').contains('Option 2').should('have.css', 'pointer-events', 'none');
        });
    });
});
