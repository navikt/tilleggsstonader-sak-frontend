import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { FullmektigDto } from '../typer/fullmakt';
import { IdentRequest } from '../typer/identrequest';
import { byggTomRessurs, erFeilressurs, pakkUtHvisSuksess, Ressurs } from '../typer/ressurs';

interface Response {
    fullmektige: FullmektigDto[];
    hentFullmektigeFeilet?: string;
}

export const useHentFullmektige = (fullmaktigiverIdent: string): Response => {
    const { request } = useApp();

    const [fullmektigeResponse, settFullmektigeResponse] =
        useState<Ressurs<FullmektigDto[]>>(byggTomRessurs());

    const hentFullmektige = useCallback(() => {
        request<FullmektigDto[], IdentRequest>(`/api/sak/fullmakt/fullmektige`, 'POST', {
            ident: fullmaktigiverIdent,
        }).then(settFullmektigeResponse);
    }, [fullmaktigiverIdent, request]);

    useEffect(() => {
        hentFullmektige();
    }, [hentFullmektige]);

    return {
        fullmektige: pakkUtHvisSuksess(fullmektigeResponse) || [],
        hentFullmektigeFeilet: erFeilressurs(fullmektigeResponse)
            ? fullmektigeResponse.frontendFeilmelding
            : undefined,
    };
};
