import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { TilbakekrevingHendelse } from '../Sider/Behandling/Venstremeny/Tilbakekreving/typer';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface UseTilbakekrevingHendelserResponse {
    tilbakekrevingHendelser: Ressurs<TilbakekrevingHendelse[]>;
    hentTilbakekrevingHendelser: () => void;
}

export const useTilbakekrevingHendelser = (
    behandlingId: string
): UseTilbakekrevingHendelserResponse => {
    const { request } = useApp();

    const [tilbakekrevingHendelser, settTilbakekrevingHendelser] =
        useState<Ressurs<TilbakekrevingHendelse[]>>(byggTomRessurs());

    const hentTilbakekrevingHendelser = useCallback(() => {
        request<TilbakekrevingHendelse[], null>(
            `/api/sak/tilbakekreving/${behandlingId}/hendelser`
        ).then(settTilbakekrevingHendelser);
    }, [request, behandlingId]);

    useEffect(() => {
        hentTilbakekrevingHendelser();
    }, [hentTilbakekrevingHendelser]);

    return { tilbakekrevingHendelser, hentTilbakekrevingHendelser };
};
