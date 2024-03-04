import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { TotrinnskontrollResponse } from '../Sider/Behandling/Totrinnskontroll/typer';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

export const useHentTotrinnskontroll = () => {
    const { request } = useApp();
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

    return {
        totrinnskontroll,
        hentTotrinnskontroll,
        settTotrinnskontroll,
    };
};
