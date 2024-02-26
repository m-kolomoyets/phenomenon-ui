import { memo } from 'react';
import { Root as LabelRoot } from '@radix-ui/react-label';
import clsx from 'clsx';
import type { FieldLabelProps } from './types';
import s from './FieldLabel.module.css';

const FieldLabel: React.FC<FieldLabelProps> = ({ className, children, ...rest }) => {
    return (
        <LabelRoot className={clsx(s.wrap, className)} {...rest}>
            {children}
        </LabelRoot>
    );
};

export default memo(FieldLabel);
