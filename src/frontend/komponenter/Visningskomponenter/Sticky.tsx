import React from 'react';

import styles from './Sticky.module.css';

interface StickyProps extends React.HTMLAttributes<HTMLDivElement> {
    zIndex?: number;
}

export const Sticky: React.FC<StickyProps> = ({ zIndex = 24, className, ...props }) => (
    <div className={`${styles.sticky} ${className ?? ''}`} style={{ zIndex: zIndex }} {...props} />
);
