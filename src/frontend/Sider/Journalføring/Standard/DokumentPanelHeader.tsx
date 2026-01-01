import React from 'react';

import { FileTextFillIcon, FileTextIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';

import styles from './DokumentPanelHeader.module.css';
import { LogiskVedlegg } from '../../../typer/dokument';

interface Props {
    dokumentTittel: string;
    erValgt: boolean;
    logiskeVedlegg: LogiskVedlegg[];
}

export const DokumentPanelHeader: React.FC<Props> = ({
    dokumentTittel,
    erValgt,
    logiskeVedlegg,
}) => {
    return (
        <HStack gap="4">
            <div className={styles.ikonContainer}>
                {erValgt ? (
                    <FileTextFillIcon fontSize={'3.5rem'} />
                ) : (
                    <FileTextIcon fontSize={'3.5rem'} />
                )}
            </div>
            <VStack gap="2" justify="center">
                <Label as={'p'}>{dokumentTittel}</Label>
                {logiskeVedlegg.length > 0 && (
                    <VStack gap={'0'}>
                        {logiskeVedlegg.map((it, index) => (
                            <BodyShort key={index}>{it.tittel}</BodyShort>
                        ))}
                    </VStack>
                )}
            </VStack>
        </HStack>
    );
};
