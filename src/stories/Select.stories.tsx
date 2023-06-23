import type { Meta, StoryObj } from '@storybook/react';
import Select, { type DefaultSelectOptionType, type SelectProps } from '../components/Select';
import { createSelectOptionsWithDefaultType } from './utils/makeData';

const meta = {
    title: 'ui/Select',
    component: Select,
    tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
    args: {
        options: createSelectOptionsWithDefaultType(20),
    } as SelectProps<DefaultSelectOptionType>,
};

export const WithLabel: Story = {
    args: {
        label: 'Select',
        options: createSelectOptionsWithDefaultType(20),
    } as SelectProps<DefaultSelectOptionType>,
};
