import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { ReisevurderingPrivatBil } from '../typer/kjøreliste';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    hentKjørelister: () => void;
    kjørelister: Ressurs<ReisevurderingPrivatBil[]>;
}

export const useKjøreliste = (): Response => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [kjørelister, settKjørelister] =
        useState<Ressurs<ReisevurderingPrivatBil[]>>(byggTomRessurs());

    const hentKjørelister = useCallback(() => {
        request<ReisevurderingPrivatBil[], null>(`/api/sak/kjoreliste/${behandling.id}`).then(
            settKjørelister
        );
    }, [behandling, request]);

    useEffect(() => {
        hentKjørelister();
    }, [hentKjørelister]);

    return {
        hentKjørelister,
        kjørelister,
    };
};
