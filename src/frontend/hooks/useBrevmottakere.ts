import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { IBrevmottakere } from '../komponenter/Brevmottakere/typer';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

export const useBrevmottakere = (
    behandlingId: string,
    applikasjonskontekst: Applikasjonskontekst
) => {
    const [brevmottakere, settBrevmottakere] = useState<Ressurs<IBrevmottakere>>(byggTomRessurs());
    const { request } = useApp();

    const urlForHentingAvBrevmottakereGittAppKontekst = byggeBrevmottakerUrlForGittKontekst(
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

const byggeBrevmottakerUrlForGittKontekst = (
    behandlingId: string,
    applikasjonskontekst: Applikasjonskontekst
) => {
    if (applikasjonskontekst === Applikasjonskontekst.KLAGE) {
        return `/api/klage/brev/${behandlingId}/mottakere`;
    }
    if (applikasjonskontekst === Applikasjonskontekst.SAK) {
        return `/api/sak/brevmottakere?behandlingId=${behandlingId}`;
    }
};

export enum Applikasjonskontekst {
    SAK = 'SAK',
    KLAGE = 'KLAGE',
}
