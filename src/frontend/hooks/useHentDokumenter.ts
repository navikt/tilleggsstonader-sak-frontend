import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { DokumentInfo, VedleggRequest } from '../typer/dokument';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

export function useHentDokumenter(
    fagsakPersonId: string,
    vedleggRequest: VedleggRequest
): Ressurs<DokumentInfo[]> {
    const { request } = useApp();
    const [dokumenter, settDokumenter] = useState<Ressurs<DokumentInfo[]>>(byggTomRessurs());

    const vedleggRequestJson = JSON.stringify(vedleggRequest);

    useEffect(() => {
        settDokumenter(byggHenterRessurs());
        request<DokumentInfo[], VedleggRequest>(
            `/api/sak/vedlegg/fagsak-person/${fagsakPersonId}`,
            'POST',
            vedleggRequest
        ).then(settDokumenter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fagsakPersonId, request, vedleggRequestJson]);

    return dokumenter;
}
