import type { WithChildren } from '@/types';
import type { TooltipProps as RadixTooltipProps } from '@radix-ui/react-tooltip';

export type TooltipProps = WithChildren<{
    label: string;
}> &
    RadixTooltipProps;
