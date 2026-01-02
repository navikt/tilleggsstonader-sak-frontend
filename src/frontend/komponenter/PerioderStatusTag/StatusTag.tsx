import React from 'react';

import { Tag } from '@navikt/ds-react';

import styles from './StatusTag.module.css';
import { PeriodeStatus } from '../../typer/behandling/periodeStatus';

export const StatusTag: React.FC<{ status?: PeriodeStatus; lesevisning: boolean }> = ({
    status,
    lesevisning,
}) => {
    if (status === PeriodeStatus.UENDRET) {
        return (
            <Tag size="small" variant="warning" className={styles.statusTag}>
                Fra tidligere vedtak
            </Tag>
        );
    }

    if (status === PeriodeStatus.ENDRET) {
        return (
            <Tag size="small" variant="warning" className={styles.statusTag}>
                Endret
            </Tag>
        );
    }

    if (lesevisning && status === PeriodeStatus.NY) {
        return (
            <Tag size="small" variant="success" className={styles.statusTag}>
                Ny
            </Tag>
        );
    }

    return null;
};
