import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { ReisevurderingPrivatBil } from '../typer/kjøreliste';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    hentReisevurderinger: () => void;
    reisevurderingerResponse: Ressurs<ReisevurderingPrivatBil[]>;
}

export const useReisevurderingPrivatBil = (): Response => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [reisevurderingerResponse, settReisevurderingerResponse] =
        useState<Ressurs<ReisevurderingPrivatBil[]>>(byggTomRessurs());

    const hentReisevurderinger = useCallback(() => {
        request<ReisevurderingPrivatBil[], null>(`/api/sak/kjoreliste/${behandling.id}`).then(
            settReisevurderingerResponse
        );
    }, [behandling, request]);

    useEffect(() => {
        hentReisevurderinger();
    }, [hentReisevurderinger]);

    return {
        hentReisevurderinger,
        reisevurderingerResponse,
    };
};
