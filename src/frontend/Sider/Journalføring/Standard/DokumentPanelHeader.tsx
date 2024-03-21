import React from 'react';

import styled from 'styled-components';

import { FileTextFillIcon, FileTextIcon } from '@navikt/aksel-icons';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';

import { LogiskVedlegg } from '../../../typer/dokument';

const Container = styled.div`
    display: flex;
    gap: 1rem;
`;

const DokumentTitler = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    justify-content: center;
`;

const IkonContainer = styled.div`
    color: ${ABlue500};
`;

interface Props {
    dokumentTittel: string;
    erValgt: boolean;
    logiskeVedlegg: LogiskVedlegg[] | undefined;
}

export const DokumentPanelHeader: React.FC<Props> = ({
    dokumentTittel,
    erValgt,
    logiskeVedlegg,
}) => {
    return (
        <Container>
            <IkonContainer>
                {erValgt ? (
                    <FileTextFillIcon fontSize={'3.5rem'} />
                ) : (
                    <FileTextIcon fontSize={'3.5rem'} />
                )}
            </IkonContainer>
            <DokumentTitler>
                <Label as={'p'}>{dokumentTittel}</Label>
                {logiskeVedlegg !== undefined &&
                    logiskeVedlegg !== null &&
                    logiskeVedlegg.length > 0 && (
                        <VStack gap={'0'}>
                            {logiskeVedlegg.map((it) => (
                                <BodyShort key={it.logiskVedleggId}>{it.tittel}</BodyShort>
                            ))}
                        </VStack>
                    )}
            </DokumentTitler>
        </Container>
    );
};
