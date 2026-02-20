import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import styles from './ReiseMetadta.module.css';
import { Reisedata } from './Typer/Reisedata';

export const ReiseMetadata: React.FC<{
    kjøreavstandResponse: Reisedata;
}> = ({ kjøreavstandResponse }) => {
    return (
        <VStack gap="space-16" className={styles.kort}>
            <VStack gap={'space-4'}>
                <Label>Startadresse:</Label>
                <BodyShort>{kjøreavstandResponse.reiserute?.startAdresse}</BodyShort>
            </VStack>
            <VStack gap={'space-4'}>
                <Label>Tiltaksadresse:</Label>
                <BodyShort>{kjøreavstandResponse.reiserute?.sluttAdresse}</BodyShort>
            </VStack>
        </VStack>
    );
};
