import React from 'react';

import {
    CalculatorIcon,
    EnvelopeClosedIcon,
    HouseHeartIcon,
    PersonRectangleIcon,
} from '@navikt/aksel-icons';

import Brev from './Brev/Brev';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import VedtakOgBeregningBarnetilsyn from './VedtakOgBeregning/Barnetilsyn/VedtakOgBeregningBarnetilsyn';

export type FanerMedRouter = {
    navn: FaneNavn;
    path: FanePath;
    komponent: (behandlingId: string) => React.ReactNode | undefined;
    ikon?: React.ReactNode;
};

export enum FaneNavn {
    INNGANGSVILKÅR = 'Inngangsvilkår',
    ARBEIDSVILKÅR = 'Vilkår for arbeid',
    VEDTAK_OG_BEREGNING = 'Vedtak og beregning',
    SIMULERING = 'Simulering',
    BREV = 'Vedtaksbrev',
}

export enum FanePath {
    INNGANGSVILKÅR = 'inngangsvilkar',
    ARBEIDSVILKÅR = 'arbeidsvilkar',
    VEDTAK_OG_BEREGNING = 'vedtak-og-beregning',
    SIMULERING = 'simulering',
    BREV = 'brev',
}

export const behandlingFaner: FanerMedRouter[] = [
    {
        navn: FaneNavn.INNGANGSVILKÅR,
        path: FanePath.INNGANGSVILKÅR,
        komponent: () => <Inngangsvilkår />,
        ikon: <PersonRectangleIcon />,
    },
    {
        navn: FaneNavn.ARBEIDSVILKÅR,
        path: FanePath.ARBEIDSVILKÅR,
        komponent: () => <p>Vilkår for arbeid</p>,
        ikon: <HouseHeartIcon />,
    },
    {
        navn: FaneNavn.VEDTAK_OG_BEREGNING,
        path: FanePath.VEDTAK_OG_BEREGNING,
        komponent: () => <VedtakOgBeregningBarnetilsyn />,
        ikon: <CalculatorIcon />,
    },
    {
        navn: FaneNavn.SIMULERING,
        path: FanePath.SIMULERING,
        komponent: () => <p>Simulering</p>,
    },
    {
        navn: FaneNavn.BREV,
        path: FanePath.BREV,
        komponent: () => <Brev />,
        ikon: <EnvelopeClosedIcon />,
    },
];
