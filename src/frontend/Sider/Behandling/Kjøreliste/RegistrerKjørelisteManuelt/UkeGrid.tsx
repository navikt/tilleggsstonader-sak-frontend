import React from 'react';

import { Label, VStack } from '@navikt/ds-react';

import styles from './UkeGrid.module.css';

export const UkeGrid: React.FC<{ gråBakgrunn?: boolean; children: React.ReactNode }> = ({
    gråBakgrunn = false,
    children,
}) => {
    return (
        <VStack align="start" paddingBlock="space-0 space-8">
            <div className={`${styles.grid} ${styles.borderToppBunn}`}>
                <Label size="small">Dag</Label>
                <Label size="small">Dato</Label>
                <Label size="small">Kjørt</Label>
                <Label size="small">Parkeringsutgift</Label>
            </div>
            <div className={`${styles.grid} ${gråBakgrunn ? styles.gråBakgrunn : ''}`}>
                {children}
            </div>
        </VStack>
    );
};
