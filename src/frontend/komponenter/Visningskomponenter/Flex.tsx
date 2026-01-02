import React from 'react';

import styles from './Flex.module.css';

interface FlexColumnProps extends React.HTMLAttributes<HTMLDivElement> {
    $gap?: number;
}

export const FlexColumn: React.FC<FlexColumnProps> = ({ $gap, className, style, ...props }) => {
    return (
        <div
            className={`${styles.flexColumn} ${className ?? ''}`}
            style={
                {
                    '--gap': `${$gap ?? 1}rem`,
                    ...style,
                } as React.CSSProperties
            }
            {...props}
        />
    );
};
