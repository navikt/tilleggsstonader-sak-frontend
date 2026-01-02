import React from 'react';

import styles from './Celle.module.css';

interface CelleProps extends React.HTMLAttributes<HTMLDivElement> {
    $width?: number;
}

export const Celle: React.FC<CelleProps> = ({ $width, className, style, ...props }) => {
    return (
        <div
            className={`${styles.celle} ${className ?? ''}`}
            style={
                {
                    '--width': $width ? `${$width}px` : 'fit-content',
                    ...style,
                } as React.CSSProperties
            }
            {...props}
        />
    );
};
