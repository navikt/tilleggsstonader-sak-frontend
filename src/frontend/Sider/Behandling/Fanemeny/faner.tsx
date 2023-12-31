import React from 'react';

import Brev from '../Brev/Brev';
import Inngangsvilkår from '../Inngangsvilkår/Inngangsvilkår';
import VedtakOgBeregningBarnetilsyn from '../VedtakOgBeregning/Barnetilsyn/VedtakOgBeregningBarnetilsyn';

export type FanerMedRouter = {
    navn: FaneNavn;
    path: string;
    komponent: (behandlingId: string) => React.ReactNode | undefined;
};

export enum FaneNavn {
    INNGANGSVILKÅR = 'Inngangsvilkår',
    ARBEIDSVILKÅR = 'Vilkår for arbeid',
    AKTIVITET = 'Aktivitet',
    VEDTAK_OG_BEREGNING = 'Vedtak og beregning',
    SIMULERING = 'Simulering',
    BREV = 'Vedtaksbrev',
}

export const behandlingFaner: FanerMedRouter[] = [
    {
        navn: FaneNavn.INNGANGSVILKÅR,
        path: 'inngangsvilkar',
        komponent: () => <Inngangsvilkår />,
    },
    {
        navn: FaneNavn.ARBEIDSVILKÅR,
        path: 'arbeidsvilkar',
        komponent: () => <p>Vilkår for arbeid</p>,
    },
    {
        navn: FaneNavn.VEDTAK_OG_BEREGNING,
        path: 'vedtak-og-beregning',
        komponent: () => <VedtakOgBeregningBarnetilsyn />,
    },
    {
        navn: FaneNavn.SIMULERING,
        path: 'simulering',
        komponent: () => <p>Simulering</p>,
    },
    {
        navn: FaneNavn.BREV,
        path: 'brev',
        komponent: () => <Brev />,
    },
];
