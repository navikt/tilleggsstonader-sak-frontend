import { useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { TotrinnskontrollResponse } from '../Totrinnskontroll/typer';

export const useSendTilBeslutter = () => {
    const { request } = useApp();
    const { behandling, hentBehandling } = useBehandling();
    const [visVedtakFerdigstiltModal, settVisVedtakFerdigstiltModal] = useState<boolean>(false);
    const behandlingId = behandling.id;

    const sendTilBeslutter = async () => {
        request<TotrinnskontrollResponse, null>(
            `/api/sak/totrinnskontroll/${behandlingId}/send-til-beslutter`,
            'POST'
        ).then((res: RessursSuksess<TotrinnskontrollResponse> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
                //hentTotrinnskontroll.rerun(); // TODO håndter henting i totrinnskontroll-komponenten
                settVisVedtakFerdigstiltModal(true);
                return Promise.resolve();
            } else {
                return Promise.reject(res.frontendFeilmelding);
            }
        });
    };

    return {
        sendTilBeslutter,
        visVedtakFerdigstiltModal,
        lukkVedtakFerdigstiltModal: () => settVisVedtakFerdigstiltModal(false),
    };
};
