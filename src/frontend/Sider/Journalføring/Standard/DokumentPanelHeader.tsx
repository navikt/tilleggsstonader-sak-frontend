import React from 'react';

import styled from 'styled-components';

import { FileTextFillIcon, FileTextIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';

import { LogiskVedlegg } from '../../../typer/dokument';

const IkonContainer = styled.div`
    color: ${ABlue500};
`;

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
            <IkonContainer>
                {erValgt ? (
                    <FileTextFillIcon fontSize={'3.5rem'} />
                ) : (
                    <FileTextIcon fontSize={'3.5rem'} />
                )}
            </IkonContainer>
            <VStack gap="2" justify="center">
                <Label as={'p'}>{dokumentTittel}</Label>
                {logiskeVedlegg.length > 0 && (
                    <VStack gap={'0'}>
                        {logiskeVedlegg.map((it) => (
                            <BodyShort key={it.logiskVedleggId}>{it.tittel}</BodyShort>
                        ))}
                    </VStack>
                )}
            </VStack>
        </HStack>
    );
};
