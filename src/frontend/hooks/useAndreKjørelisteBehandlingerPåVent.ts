import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { Behandlingsoversikt } from '../typer/behandling/behandlingoversikt';
import { BehandlingStatus } from '../typer/behandling/behandlingStatus';
import { BehandlingType } from '../typer/behandling/behandlingType';
import { RessursStatus } from '../typer/ressurs';

export function useAndreKjørelisteBehandlingerPåVent(): number {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const [antall, settAntall] = useState(0);

    useEffect(() => {
        request<Behandlingsoversikt, null>(
            `/api/sak/behandling/fagsak-person/${behandling.fagsakPersonId}`
        ).then((resp) => {
            if (resp.status !== RessursStatus.SUKSESS) return;

            const oversikt = resp.data;
            const riktigFagsak = [
                oversikt.tilsynBarn,
                oversikt.læremidler,
                oversikt.boutgifter,
                oversikt.dagligReiseTso,
                oversikt.dagligReiseTsr,
            ].find((f) => f?.fagsakId === behandling.fagsakId);

            const andreKjørelistePåVent =
                riktigFagsak?.behandlinger.filter(
                    (b) =>
                        b.type === BehandlingType.KJØRELISTE &&
                        b.status === BehandlingStatus.SATT_PÅ_VENT &&
                        b.id !== behandling.id
                ) ?? [];

            settAntall(andreKjørelistePåVent.length);
        });
    }, [behandling.fagsakPersonId, behandling.fagsakId, behandling.id, request]);

    return antall;
}
