import type { Meta, StoryObj } from '@storybook/react';
import Select, { type SelectProps } from '../components/Select';

const meta = {
	title: 'ui/Select',
	component: Select,
	tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
	args: {} as SelectProps,
};
