import React from 'react';

import styles from './VertikalSentrering.module.css';

export const VertikalSentrering: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => {
    return <div className={`${styles.vertikalSentrering} ${className || ''}`} {...props} />;
};
