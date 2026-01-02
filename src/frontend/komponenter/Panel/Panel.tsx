import React, { FC } from 'react';

import { Heading, HStack, Spacer } from '@navikt/ds-react';
import { BgDefault, BorderNeutral } from '@navikt/ds-tokens/darkside-js';

import styles from './Panel.module.css';

interface Props {
    tittel: string;
    ikon?: React.ReactNode;
    ekstraHeading?: React.ReactNode;
    children: React.ReactNode;
    kontekstmeny?: React.ReactNode;
}

const Panel: FC<Props> = ({ ekstraHeading, tittel, ikon, children, kontekstmeny }) => {
    return (
        <div
            className={styles.container}
            style={
                {
                    '--bg-color': BgDefault,
                    '--border-color': BorderNeutral,
                } as React.CSSProperties
            }
        >
            <div className={styles.header}>
                <HStack gap="2" align="center">
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
