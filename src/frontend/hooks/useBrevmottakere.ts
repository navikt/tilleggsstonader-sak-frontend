import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Applikasjonskontekst, IBrevmottakere } from '../komponenter/Brevmottakere/typer';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

export type ContextBrevmottakere =
    | { type: Applikasjonskontekst.SAK; behandlingId: string }
    | { type: Applikasjonskontekst.KLAGE; behandlingId: string }
    | { type: 'frittstående-brev'; fagsakId: string };

export const useBrevmottakere = (context: ContextBrevmottakere) => {
    const [brevmottakere, settBrevmottakere] = useState<Ressurs<IBrevmottakere>>(byggTomRessurs());
    const { request } = useApp();

    const hentBrevmottakere = useCallback(() => {
        request<IBrevmottakere, null>(byggBrevmottakerUrlForGittKontekst(context)).then(
            settBrevmottakere
        );
    }, [context, request]);

    const lagreBrevmottakere = useCallback(
        (brevmottakere: IBrevmottakere) =>
            request<IBrevmottakere, IBrevmottakere>(
                byggBrevmottakerUrlForGittKontekst(context),
                'POST',
                brevmottakere
            ),
        [request, context]
    );

    useEffect(() => {
        hentBrevmottakere();
    }, [hentBrevmottakere]);

    return { brevmottakere, hentBrevmottakere, lagreBrevmottakere };
};

const byggBrevmottakerUrlForGittKontekst = (context: ContextBrevmottakere): string => {
    if (context.type === Applikasjonskontekst.KLAGE) {
        return `/api/klage/brev/${context.behandlingId}/mottakere`;
    }
    if (context.type === Applikasjonskontekst.SAK) {
        return `/api/sak/brevmottakere/${context.behandlingId}`;
    }

    if (context.type === 'frittstående-brev') {
        return `/api/sak/brevmottakere/fagsak/${context.fagsakId}`;
    }

    return 'IKKE-GYDLIG-URL';
};
