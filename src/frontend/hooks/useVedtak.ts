import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { Ressurs, byggTomRessurs } from '../typer/ressurs';
import { VedtakResponse } from '../typer/vedtak/vedtak';

interface Response<T extends VedtakResponse> {
    hentVedtak: (behandlingId: string) => void;
    vedtak: Ressurs<T>;
}

const stønadstypeTilVedtakUrl: Record<Stønadstype, string> = {
    [Stønadstype.BARNETILSYN]: 'tilsyn-barn',
    [Stønadstype.LÆREMIDLER]: 'laremidler',
};

export const useVedtak = <T extends VedtakResponse>(): Response<T> => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [vedtak, settVedtak] = useState<Ressurs<T>>(byggTomRessurs());

    const hentVedtak = useCallback(() => {
        request<T, null>(
            `/api/sak/vedtak/${stønadstypeTilVedtakUrl[behandling.stønadstype]}/${behandling.id}`
        ).then(settVedtak);
    }, [behandling, request]);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    return {
        hentVedtak,
        vedtak,
    };
};
