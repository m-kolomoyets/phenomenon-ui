import { memo } from 'react';
import clsx from 'clsx';
import type { SelectProps } from './types';
import s from './Select.module.css';

const Select: React.FC<SelectProps> = ({ className }) => {
	return <div className={clsx(s.wrap, className)}>Select</div>;
};

export default memo(Select);
