import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { useBehandling } from './BehandlingContext';
import { usePrevious } from '../hooks/usePrevious';
import { TotrinnskontrollResponse } from '../Sider/Behandling/Totrinnskontroll/typer';
import { Behandling } from '../typer/behandling/behandling';
import { BehandlingStatus } from '../typer/behandling/behandlingStatus';
import { Ressurs, byggTomRessurs, byggHenterRessurs } from '../typer/ressurs';

export const [TotrinnskontrollProvider, useTotrinnskontroll] = constate(() => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const prevBehandling = usePrevious(behandling);

    const [totrinnskontroll, settTotrinnskontroll] =
        useState<Ressurs<TotrinnskontrollResponse>>(byggTomRessurs());

    const hentTotrinnskontroll = useCallback(
        (behandlingId: string) => {
            settTotrinnskontroll(byggHenterRessurs);
            request<TotrinnskontrollResponse, null>(
                `/api/sak/totrinnskontroll/${behandlingId}`
            ).then(settTotrinnskontroll);
        },
        [request, settTotrinnskontroll]
    );

    useEffect(() => {
        if (skalHenteTotrinnskontroll(prevBehandling, behandling)) {
            hentTotrinnskontroll(behandling.id);
        }
    }, [prevBehandling, behandling, hentTotrinnskontroll]);

    return {
        totrinnskontroll,
        settTotrinnskontroll,
    };
});

/**
 * Skal hente totrinnskontroll:
 *  * Første rendering av siden hvis status er UTREDES eller FATTER_VEDTAK
 *  * Hvis status går fra utredes til fatter vedtak (sender til totrinnskontroll)
 */
const skalHenteTotrinnskontroll = (
    prevBehandling: Behandling | undefined,
    behandling: Behandling
) => {
    const forrigeStatus = prevBehandling?.status;
    const nyStatus = behandling.status;
    const statusErUendret = forrigeStatus === nyStatus;

    if (statusErUendret) return false;
    // Init-henting / sender til beslutter (send til beslutter kan erstattes hvis den knappen blir flyttet fra brev)
    if (nyStatus === BehandlingStatus.FATTER_VEDTAK) return true;

    // Init-henting
    return !forrigeStatus && nyStatus === BehandlingStatus.UTREDES;
};
