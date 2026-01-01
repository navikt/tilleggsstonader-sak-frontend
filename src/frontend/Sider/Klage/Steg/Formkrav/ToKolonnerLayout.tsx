import React from 'react';

import styles from './ToKolonnerLayout.module.css';

interface Props {
    children: {
        venstre: React.ReactNode;
        høyre: React.ReactNode;
    };
}

export const ToKolonnerLayout: React.FC<Props> = ({ children: { venstre, høyre } }) => {
    return (
        <div className={styles.container}>
            <div className={styles.venstreKolonne}>{venstre}</div>
            <div className={styles.hoyreKolonne}>{høyre}</div>
        </div>
    );
};
