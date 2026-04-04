import React from 'react';

import { BodyShort, CopyButton, HStack, Label, VStack } from '@navikt/ds-react';

import styles from './ReiseMetadta.module.css';
import { Reisedata } from './Typer/Reisedata';

export const ReiseMetadata: React.FC<{
    kjøreavstandResponse: Reisedata;
}> = ({ kjøreavstandResponse }) => {
    return (
        <VStack gap="space-16" className={styles.kort}>
            <VStack gap={'space-4'}>
                <Label>Startadresse:</Label>
                <HStack gap={'space-2'}>
                    <BodyShort>{kjøreavstandResponse.reiserute?.startAdresse}</BodyShort>
                    <CopyButton
                        size={'xsmall'}
                        copyText={kjøreavstandResponse.reiserute?.startAdresse || ''}
                    />
                </HStack>
            </VStack>
            <VStack gap={'space-4'}>
                <Label>Tiltaksadresse:</Label>
                <HStack gap={'space-2'}>
                    <BodyShort>{kjøreavstandResponse.reiserute?.sluttAdresse}</BodyShort>
                    <CopyButton
                        size={'xsmall'}
                        copyText={kjøreavstandResponse.reiserute?.sluttAdresse || ''}
                    />
                </HStack>
            </VStack>
        </VStack>
    );
};
