import { memo } from 'react';
import {
    Root as TooltipRoot,
    Trigger as TooltipTrigger,
    Portal as TooltipPortal,
    Content as TooltipContent,
    Arrow as TooltipArrow,
    Provider as TooltipProvider,
} from '@radix-ui/react-tooltip';
import type { TooltipProps } from './types';
import s from './Tooltip.module.css';

const Tooltip: React.FC<TooltipProps> = ({ label, children, ...rest }) => {
    return (
        <TooltipProvider>
            <TooltipRoot {...rest}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent className={s.content}>
                        {label}
                        <TooltipArrow />
                    </TooltipContent>
                </TooltipPortal>
            </TooltipRoot>
        </TooltipProvider>
    );
};

export default memo(Tooltip);
