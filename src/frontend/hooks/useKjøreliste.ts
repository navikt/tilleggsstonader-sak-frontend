import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { ReisevurderingPrivatBil } from '../typer/kjøreliste';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    hentKjørelister: () => void;
    reisevurderingerResponse: Ressurs<ReisevurderingPrivatBil[]>;
}

export const useReisevurderingPrivatBil = (): Response => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [reisevurderingerResponse, settReisevurderingerResponse] =
        useState<Ressurs<ReisevurderingPrivatBil[]>>(byggTomRessurs());

    const hentKjørelister = useCallback(() => {
        request<ReisevurderingPrivatBil[], null>(`/api/sak/kjoreliste/${behandling.id}`).then(
            settReisevurderingerResponse
        );
    }, [behandling, request]);

    useEffect(() => {
        hentKjørelister();
    }, [hentKjørelister]);

    return {
        hentKjørelister,
        reisevurderingerResponse,
    };
};
