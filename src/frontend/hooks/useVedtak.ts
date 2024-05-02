import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { Ressurs, byggTomRessurs } from '../typer/ressurs';
import { VedtakBarnetilsyn } from '../typer/vedtak';

interface Response {
    hentVedtak: (behandlingId: string) => void;
    vedtak: Ressurs<VedtakBarnetilsyn>;
}

export const useVedtak = (): Response => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [vedtak, settVedtak] = useState<Ressurs<VedtakBarnetilsyn>>(byggTomRessurs());

    const hentVedtak = useCallback(() => {
        request<VedtakBarnetilsyn, null>(`/api/sak/vedtak/tilsyn-barn/${behandling.id}`).then(
            settVedtak
        );
    }, [behandling, request]);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    return {
        hentVedtak,
        vedtak,
    };
};
