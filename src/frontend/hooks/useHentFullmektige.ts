import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { FullmektigDto } from '../typer/fullmakt';
import { IdentRequest } from '../typer/identrequest';
import { byggTomRessurs, feilmeldingVedFeil, pakkUtHvisSuksess, Ressurs } from '../typer/ressurs';

interface FullmektigeEllerFeilmelding {
    fullmektige?: FullmektigDto[];
    hentFullmektigeFeil?: string;
}

export function useHentFullmektige(fullmaktigiverIdent: string): FullmektigeEllerFeilmelding {
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
        fullmektige: pakkUtHvisSuksess(fullmektigeResponse),
        hentFullmektigeFeil: feilmeldingVedFeil(fullmektigeResponse),
    };
}
