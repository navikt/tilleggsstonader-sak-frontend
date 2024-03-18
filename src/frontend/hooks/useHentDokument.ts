import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Journalpost } from '../typer/journalpost';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    hentDokument: (dokumentInfoId: string) => void;
    valgtDokument: Ressurs<string>;
    hentFørsteDokument: () => void;
}

export const useHentDokument = (journalpost: Journalpost): Response => {
    const { request } = useApp();

    const [valgtDokument, settValgtDokument] = useState<Ressurs<string>>(byggTomRessurs());

    const hentDokument = useCallback(
        (dokumentInfoId: string) => {
            request<string, null>(
                `/familie-ef-sak/api/journalpost/${journalpost.journalpostId}/dokument/${dokumentInfoId}`
            ).then(settValgtDokument);
        },
        [request, journalpost.journalpostId]
    );

    const hentDokumentForIndex = useCallback(
        (index: number) => {
            if (journalpost.dokumenter && journalpost.dokumenter.length > index) {
                hentDokument(journalpost.dokumenter[index].dokumentinfoId);
            }
        },
        [hentDokument, journalpost]
    );

    const hentFørsteDokument = useCallback(() => {
        hentDokumentForIndex(0);
    }, [hentDokumentForIndex]);

    return {
        hentDokument,
        valgtDokument,
        hentFørsteDokument,
    };
};
