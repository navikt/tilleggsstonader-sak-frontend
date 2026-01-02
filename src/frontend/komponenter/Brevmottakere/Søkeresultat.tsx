import React, { ReactNode } from 'react';

import styles from './Søkeresultat.module.css';
import { classNames } from '../../utils/classNames';

export const Søkeresultat: React.FC<{ children: ReactNode; className?: string }> = ({
    children,
    className,
}) => <div className={classNames([styles.søkeresultat, className])}>{children}</div>;
