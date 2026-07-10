import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { Behandlingsoversikt } from '../typer/behandling/behandlingoversikt';
import { BehandlingStatus } from '../typer/behandling/behandlingStatus';
import { BehandlingType } from '../typer/behandling/behandlingType';
import { RessursStatus } from '../typer/ressurs';

export function useErKjørelistebehandlingerPåVent(): number {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const [kjørelisterPåVent, settkjørelisterPåVent] = useState(0);

    useEffect(() => {
        request<Behandlingsoversikt, null>(
            `/api/sak/behandling/fagsak-person/${behandling.fagsakPersonId}`
        ).then((res) => {
            if (res.status !== RessursStatus.SUKSESS) return;

            const behandlingsOversikt = res.data;
            const fagsakMedBehandlinger = [
                behandlingsOversikt.dagligReiseTso,
                behandlingsOversikt.dagligReiseTsr,
            ].find((fagsak) => fagsak?.fagsakId === behandling.fagsakId);

            const andreKjørelisterPåVent =
                fagsakMedBehandlinger?.behandlinger.filter(
                    (b) =>
                        b.type === BehandlingType.KJØRELISTE &&
                        b.status === BehandlingStatus.SATT_PÅ_VENT &&
                        b.id !== behandling.id
                ) ?? [];

            settkjørelisterPåVent(andreKjørelisterPåVent.length);
        });
    }, [behandling.fagsakPersonId, behandling.fagsakId, behandling.id, request]);

    return kjørelisterPåVent;
}
