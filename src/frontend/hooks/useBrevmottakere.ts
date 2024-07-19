import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Applikasjonskontekst, IBrevmottakere } from '../komponenter/Brevmottakere/typer';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

export const useBrevmottakere = (
    behandlingId: string,
    applikasjonskontekst: Applikasjonskontekst
) => {
    const [brevmottakere, settBrevmottakere] = useState<Ressurs<IBrevmottakere>>(byggTomRessurs());
    const { request } = useApp();

    const urlForHentingAvBrevmottakereGittAppKontekst = byggBrevmottakerUrlForGittKontekst(
        behandlingId,
        applikasjonskontekst
    );

    const hentBrevmottakere = () => {
        request<IBrevmottakere, null>(`${urlForHentingAvBrevmottakereGittAppKontekst}`).then(
            settBrevmottakere
        );
    };

    useEffect(() => {
        hentBrevmottakere();
    }, [behandlingId]);

    return { brevmottakere, hentBrevmottakere };
};

export const byggBrevmottakerUrlForGittKontekst = (
    behandlingId: string,
    applikasjonskontekst: Applikasjonskontekst
): string => {
    if (applikasjonskontekst === Applikasjonskontekst.KLAGE) {
        return `/api/klage/brev/${behandlingId}/mottakere`;
    }
    if (applikasjonskontekst === Applikasjonskontekst.SAK) {
        return `/api/sak/brevmottakere/${behandlingId}`;
    } else {
        return 'IKKE-GYDLIG-URL';
    }
};
