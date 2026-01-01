import React from 'react';

import { Heading, HStack, Tag, VStack } from '@navikt/ds-react';

import styles from './OversiktKort.module.css';

interface Props {
    tittel: string;
    tagTittel?: string;
    tagVariant?: 'info' | 'alt2';
    children: React.ReactNode;
}

export const OversiktKort: React.FC<Props> = ({ tittel, tagTittel, tagVariant, children }) => {
    return (
        <VStack gap={'6'} className={styles.container}>
            <HStack justify={'space-between'}>
                <Heading size={'small'}>{tittel}</Heading>
                <Tag size={'small'} variant={tagVariant ? tagVariant : 'alt2'}>
                    {tagTittel ? tagTittel : 'TS - Sak'}
                </Tag>
            </HStack>
            {children}
        </VStack>
    );
};
