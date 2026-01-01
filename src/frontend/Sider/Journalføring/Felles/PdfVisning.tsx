import React, { useMemo } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack } from '@navikt/ds-react';

import styles from './PdfVisning.module.css';
import { JournalføringState } from '../../../hooks/useJournalføringState';

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
        <div className={styles.container}>
            <div className={styles.navigerDokumentContainer}>
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
            </div>
            {dokumentMemo}
        </div>
    );
};

export default PdfVisning;
