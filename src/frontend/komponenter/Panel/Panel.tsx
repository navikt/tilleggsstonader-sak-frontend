import React, { FC } from 'react';

import { Heading, HStack, Spacer } from '@navikt/ds-react';
import { BgDefault, BgNeutralSoft, BorderNeutral } from '@navikt/ds-tokens/js';

import styles from './Panel.module.css';

interface Props {
    tittel: string;
    ikon?: React.ReactNode;
    ekstraHeading?: React.ReactNode;
    children: React.ReactNode;
    kontekstmeny?: React.ReactNode;
    erAktiv?: boolean;
}

const Panel: FC<Props> = ({ ekstraHeading, tittel, ikon, children, kontekstmeny, erAktiv }) => {
    return (
        <div
            className={styles.container}
            style={
                {
                    '--bg-color': erAktiv ? BgDefault : BgNeutralSoft,
                    '--border-color': BorderNeutral,
                } as React.CSSProperties
            }
        >
            <div className={styles.header}>
                <HStack gap="space-8" align="center">
                    {ikon}
                    <Heading size="small">{tittel}</Heading>
                </HStack>
                {ekstraHeading}
                <Spacer />
                {kontekstmeny}
            </div>
            <div className={styles.innhold}>{children}</div>
        </div>
    );
};

export default Panel;
