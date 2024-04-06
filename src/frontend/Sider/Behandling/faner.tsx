import React from 'react';

import {
    CalculatorIcon,
    EnvelopeClosedIcon,
    HouseHeartIcon,
    PersonRectangleIcon,
} from '@navikt/aksel-icons';

import Brev from './Brev/Brev';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import Stønadsvilkår from './Stønadsvilkår/Stønadsvilkår';
import VedtakOgBeregningBarnetilsyn from './VedtakOgBeregning/Barnetilsyn/VedtakOgBeregningBarnetilsyn';
import { Stønadstype } from '../../typer/behandling/behandlingTema';
import { Steg } from '../../typer/behandling/steg';

export type FanerMedRouter = {
    navn: FaneNavn | StønadsvilkårFaneNavn;
    path: FanePath;
    komponent: (behandlingId: string) => React.ReactNode | undefined;
    ikon?: React.ReactNode;
};

export enum FaneNavn {
    INNGANGSVILKÅR = 'Inngangsvilkår',
    VEDTAK_OG_BEREGNING = 'Vedtak og beregning',
    SIMULERING = 'Simulering',
    BREV = 'Vedtaksbrev',
}

export enum StønadsvilkårFaneNavn {
    PASS_BARN = 'Pass barn',
}

const faneNavnStønadsvilkår: Record<Stønadstype, StønadsvilkårFaneNavn> = {
    BARNETILSYN: StønadsvilkårFaneNavn.PASS_BARN,
};

export enum FanePath {
    INNGANGSVILKÅR = 'inngangsvilkar',
    STØNADSVILKÅR = 'stonadsvilkar',
    VEDTAK_OG_BEREGNING = 'vedtak-og-beregning',
    SIMULERING = 'simulering',
    BREV = 'brev',
}

export const faneTilSteg: Record<FanePath, Steg> = {
    inngangsvilkar: Steg.INNGANGSVILKÅR,
    stonadsvilkar: Steg.VILKÅR,
    'vedtak-og-beregning': Steg.BEREGNE_YTELSE,
    simulering: Steg.SEND_TIL_BESLUTTER,
    brev: Steg.SEND_TIL_BESLUTTER,
};

export const isFanePath = (path: string): path is FanePath => {
    switch (path) {
        case FanePath.INNGANGSVILKÅR:
        case FanePath.STØNADSVILKÅR:
        case FanePath.VEDTAK_OG_BEREGNING:
        case FanePath.SIMULERING:
        case FanePath.BREV:
            return true;
        default:
            return false;
    }
};

export const hentBehandlingfaner = (stønadstype: Stønadstype): FanerMedRouter[] => {
    return [
        {
            navn: FaneNavn.INNGANGSVILKÅR,
            path: FanePath.INNGANGSVILKÅR,
            komponent: () => <Inngangsvilkår />,
            ikon: <PersonRectangleIcon />,
        },
        {
            navn: faneNavnStønadsvilkår[stønadstype],
            path: FanePath.STØNADSVILKÅR,
            komponent: () => <Stønadsvilkår />,
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
};
