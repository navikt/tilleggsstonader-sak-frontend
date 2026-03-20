import React from 'react';

import { Skeleton } from '@navikt/ds-react';

import styles from './BrevSkeleton.module.css';

export const BrevSkeleton: React.FC = () => {
    // Generere opp linjer av tilfeldig lengde så det ser ut som en naturlig placeholder for tekst
    const linjer = Array.from({ length: 20 }, () => `${Math.floor(Math.random() * 45) + 51}%`);
    return (
        <div className={styles.pdfSkeleton}>
            <Skeleton variant="text" width="45%" height={28} />
            <br />
            {linjer.map((width, i) => (
                <Skeleton key={i} variant="text" width={width} />
            ))}
        </div>
    );
};
