import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { JournalpostResponse } from '../typer/journalpost';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    hentJournalPost: (journalpostId: string | null) => void;
    journalResponse: Ressurs<JournalpostResponse>;
}

export const useHentJournalpost = (): Response => {
    const { request } = useApp();

    const [journalResponse, settJournalResponse] =
        useState<Ressurs<JournalpostResponse>>(byggTomRessurs());

    const hentJournalPost = useCallback(
        (journalpostId: string | null) => {
            request<JournalpostResponse, null>(`/api/sak/journalpost/${journalpostId}`).then(
                settJournalResponse
            );
        },
        [request]
    );

    return {
        hentJournalPost,
        journalResponse,
    };
};
