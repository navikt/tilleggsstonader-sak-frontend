import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { stønadstypeTilVedtakUrl } from '../Sider/Behandling/VedtakOgBeregning/Felles/stønadstypeTilVedtakUrl';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { VedtakResponse } from '../typer/vedtak/vedtak';

interface Response<T extends VedtakResponse> {
    hentVedtak: () => void;
    vedtak: Ressurs<T>;
}

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

export const useVedtakForrigeBehandling = <T extends VedtakResponse>(): {
    forrigeVedtak: Ressurs<T>;
    hentForrigeVedtak: (stønadstype: Stønadstype, forrigeIverksatteBehandlingId: string) => void;
} => {
    const { request } = useApp();

    const [forrigeVedtak, settForrigeVedtak] = useState<Ressurs<T>>(byggTomRessurs());

    const hentForrigeVedtak = useCallback(
        (stønadstype: Stønadstype, forrigeIverksatteBehandlingId: string) => {
            request<T, null>(
                `/api/sak/vedtak/${stønadstypeTilVedtakUrl[stønadstype]}/${forrigeIverksatteBehandlingId}`
            ).then(settForrigeVedtak);
        },
        [request]
    );

    return {
        hentForrigeVedtak,
        forrigeVedtak,
    };
};
