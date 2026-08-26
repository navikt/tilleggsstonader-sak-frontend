import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Journalpost, Journalposttype } from '../typer/journalpost';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

export function useHentJournalposterForFagsak(
    fagsakId: string,
    journalposttyper?: Journalposttype[]
): Ressurs<Journalpost[]> {
    const { request } = useApp();
    const [journalposter, settJournalposter] = useState<Ressurs<Journalpost[]>>(byggTomRessurs());

    const journalposttypeQuery = journalposttyper
        ?.map((type) => `journalposttype=${type}`)
        .join('&');

    useEffect(() => {
        const url = journalposttypeQuery
            ? `/api/sak/journalpost/fagsak/${fagsakId}?${journalposttypeQuery}`
            : `/api/sak/journalpost/fagsak/${fagsakId}`;

        settJournalposter(byggHenterRessurs());
        request<Journalpost[], null>(url).then(settJournalposter);
    }, [fagsakId, journalposttypeQuery, request]);

    return journalposter;
}
