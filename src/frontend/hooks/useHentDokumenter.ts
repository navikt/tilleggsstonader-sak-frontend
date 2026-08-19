import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { DokumentInfo, VedleggRequest } from '../typer/dokument';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

export function useHentDokumenter(
    fagsakPersonId: string,
    vedleggRequest: VedleggRequest
): Ressurs<DokumentInfo[]> {
    const { request } = useApp();
    const [dokumenter, settDokumenter] = useState<Ressurs<DokumentInfo[]>>(byggTomRessurs());

    // JSON.stringify brukes for stabil samanlikning av vedleggRequest-objektet
    const vedleggRequestJson = JSON.stringify(vedleggRequest);

    useEffect(() => {
        request<DokumentInfo[], VedleggRequest>(
            `/api/sak/vedlegg/fagsak-person/${fagsakPersonId}`,
            'POST',
            vedleggRequest
        ).then(settDokumenter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fagsakPersonId, request, vedleggRequestJson]);

    return dokumenter;
}
