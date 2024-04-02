import { Dispatch, SetStateAction, useState } from 'react';

import { DokumentInfo, DokumentTitler, LogiskeVedleggPåDokument } from '../typer/dokument';
import { Journalpost, JournalpostResponse } from '../typer/journalpost';

export interface JournalføringState {
    dokumentTitler?: DokumentTitler;
    settDokumentTitler: Dispatch<SetStateAction<DokumentTitler | undefined>>;
    journalpost: Journalpost;
    logiskeVedleggPåDokument?: LogiskeVedleggPåDokument;
    settLogiskeVedleggPåDokument: Dispatch<SetStateAction<LogiskeVedleggPåDokument>>;
    valgtDokumentPanel: string;
    settValgtDokumentPanel: Dispatch<SetStateAction<string>>;
    nyAvsender: NyAvsender | undefined;
    settNyAvsender: Dispatch<SetStateAction<NyAvsender | undefined>>;
}

interface NyAvsender {
    erBruker: boolean;
    navn?: string;
    personIdent?: string;
}

export const useJournalføringState = (journalResponse: JournalpostResponse): JournalføringState => {
    const { journalpost } = journalResponse;

    const initielleLogiskeVedlegg = journalResponse.journalpost.dokumenter.reduce(
        (acc, { dokumentInfoId, logiskeVedlegg }) => ({
            ...acc,
            [dokumentInfoId]: logiskeVedlegg,
        }),
        {} as LogiskeVedleggPåDokument
    );

    const utledFørsteDokument = (dokumenter: DokumentInfo[]) =>
        dokumenter.length > 0 ? dokumenter[0].dokumentInfoId : '';

    const [dokumentTitler, settDokumentTitler] = useState<DokumentTitler>();
    const [logiskeVedleggPåDokument, settLogiskeVedleggPåDokument] =
        useState<LogiskeVedleggPåDokument>(initielleLogiskeVedlegg);
    const [valgtDokumentPanel, settValgtDokumentPanel] = useState<string>(
        utledFørsteDokument(journalpost.dokumenter)
    );
    const [nyAvsender, settNyAvsender] = useState<NyAvsender>();

    return {
        dokumentTitler,
        settDokumentTitler,
        journalpost,
        logiskeVedleggPåDokument,
        settLogiskeVedleggPåDokument,
        valgtDokumentPanel,
        settValgtDokumentPanel,
        nyAvsender,
        settNyAvsender,
    };
};
