import React from 'react';

import styles from './FeilmeldingFastBredde.module.css';

interface FeilmeldingMaksBreddeProps extends React.HTMLAttributes<HTMLDivElement> {
    $maxWidth?: number;
}

export const FeilmeldingMaksBredde: React.FC<FeilmeldingMaksBreddeProps> = ({
    $maxWidth,
    className,
    style,
    ...props
}) => {
    return (
        <div
            className={`${styles.feilmeldingMaksBredde} ${className ?? ''}`}
            style={
                {
                    '--max-width': `${$maxWidth ?? 130}px`,
                    ...style,
                } as React.CSSProperties
            }
            {...props}
        />
    );
};
