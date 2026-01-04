import React from 'react';

import styles from './FlexColumn.module.css';
import { classNames } from '../../utils/classNames';

interface FlexColumnProps extends React.HTMLAttributes<HTMLDivElement> {
    gap?: 1 | 2 | undefined;
}

export const FlexColumn: React.FC<FlexColumnProps> = ({ gap = 1, className, ...props }) => {
    return (
        <div
            className={classNames([styles.flexColumn, className ?? ''])}
            data-gap={gap}
            {...props}
        />
    );
};
