import React, { useMemo } from 'react';

import styled from 'styled-components';

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack } from '@navikt/ds-react';

import { JournalføringState } from '../../../hooks/useJournalføringState';

const Container = styled.div`
    flex: 1 1 auto;
`;

const NavigerDokumentContainer = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
`;

const PdfVisning: React.FC<{
    journalpostState: JournalføringState;
}> = ({ journalpostState }) => {
    const { journalpost, valgtDokumentPanel, settValgtDokumentPanel } = journalpostState;

    const dokumentMemo = useMemo(() => {
        return (
            <iframe
                title={'dokument'}
                src={`/dokument/journalpost/${journalpost.journalpostId}/dokument-pdf/${valgtDokumentPanel}`}
                width={'100%'}
                height={'100%'}
            />
        );
    }, [journalpost.journalpostId, valgtDokumentPanel]);

    const nåværendeIndex = journalpost.dokumenter.findIndex(
        (d) => d.dokumentInfoId === valgtDokumentPanel
    );

    const navigerTilNesteDokument = () => {
        if (nåværendeIndex === journalpost.dokumenter.length - 1) return;
        settValgtDokumentPanel(journalpost.dokumenter[nåværendeIndex + 1].dokumentInfoId);
    };

    const gåTilForrigeDokument = () => {
        if (nåværendeIndex === 0) return;
        settValgtDokumentPanel(journalpost.dokumenter[nåværendeIndex - 1].dokumentInfoId);
    };

    return (
        <Container>
            <NavigerDokumentContainer>
                <BodyShort>
                    Dokument {nåværendeIndex + 1} av {journalpost.dokumenter.length}
                </BodyShort>
                <HStack gap="2">
                    <Button
                        onClick={gåTilForrigeDokument}
                        disabled={nåværendeIndex === 0}
                        icon={<ChevronLeftIcon />}
                        size="small"
                        variant="secondary"
                    />
                    <Button
                        onClick={navigerTilNesteDokument}
                        disabled={nåværendeIndex === journalpost.dokumenter.length - 1}
                        icon={<ChevronRightIcon />}
                        size="small"
                        variant="secondary"
                    />
                </HStack>
            </NavigerDokumentContainer>
            {dokumentMemo}
        </Container>
    );
};

export default PdfVisning;
