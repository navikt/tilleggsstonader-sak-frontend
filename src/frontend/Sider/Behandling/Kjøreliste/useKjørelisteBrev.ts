import { useCallback, useEffect, useState } from 'react';

import { KjørelistebrevDto } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import {
    byggRessursFeilet,
    byggRessursSuksess,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
} from '../../../typer/ressurs';

export const useKjørelisteBrev = () => {
    const { request } = useApp();
    const { behandling, behandlingErRedigerbar } = useBehandling();

    const [brevPdf, settBrevPdf] = useState<Ressurs<string>>(byggTomRessurs());
    const [lagretBegrunnelse, settLagretBegrunnelse] = useState<string | null | undefined>(
        undefined
    );

    const hentEllerGenererBrev = useCallback(() => {
        if (behandlingErRedigerbar) {
            request<KjørelistebrevDto, { begrunnelse: null }>(
                `/api/sak/kjorelistebrev/${behandling.id}`,
                'POST',
                { begrunnelse: null }
            )
                .then((res) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        settBrevPdf(byggRessursSuksess(res.data.pdf));
                        settLagretBegrunnelse(res.data.begrunnelse);
                    } else {
                        settBrevPdf(res as RessursFeilet);
                    }
                })
                .catch(() => settBrevPdf(byggRessursFeilet('Kunne ikke laste brev')));
        } else {
            request<string, undefined>(`/api/sak/kjorelistebrev/${behandling.id}`, 'GET')
                .then(settBrevPdf)
                .catch(() => settBrevPdf(byggRessursFeilet('Kunne ikke laste brev')));
        }
    }, [behandlingErRedigerbar, behandling.id, request]);

    useEffect(() => {
        hentEllerGenererBrev();
    }, [hentEllerGenererBrev]);

    return { brevPdf, settBrevPdf, lagretBegrunnelse };
};
