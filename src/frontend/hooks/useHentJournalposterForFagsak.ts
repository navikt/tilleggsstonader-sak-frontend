import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Journalpost } from '../typer/journalpost';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

export function useHentJournalposterForFagsak(fagsakId: string): Ressurs<Journalpost[]> {
    const { request } = useApp();
    const [journalposter, settJournalposter] = useState<Ressurs<Journalpost[]>>(byggTomRessurs());

    useEffect(() => {
        settJournalposter(byggHenterRessurs());
        request<Journalpost[], null>(`/api/sak/journalpost/fagsak/${fagsakId}`).then(
            settJournalposter
        );
    }, [fagsakId, request]);

    return journalposter;
}
