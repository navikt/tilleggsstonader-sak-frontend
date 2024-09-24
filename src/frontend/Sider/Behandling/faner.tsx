import React from 'react';

import {
    CalculatorIcon,
    ClockIcon,
    EnvelopeClosedIcon,
    HouseHeartIcon,
    PersonRectangleIcon,
} from '@navikt/aksel-icons';

import Brev from './Brev/Brev';
import { KorrigeringFane } from './Fanemeny/KorrigeringFane';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import { RevurderFra } from './RevurderFra/RevurderFra';
import Simulering from './Simulering/Simulering';
import Stønadsvilkår from './Stønadsvilkår/Stønadsvilkår';
import VedtakOgBeregningBarnetilsyn from './VedtakOgBeregning/Barnetilsyn/VedtakOgBeregningBarnetilsyn';
import { Behandling } from '../../typer/behandling/behandling';
import { BehandlingResultat } from '../../typer/behandling/behandlingResultat';
import { Stønadstype } from '../../typer/behandling/behandlingTema';
import { BehandlingType } from '../../typer/behandling/behandlingType';
import { BehandlingÅrsak } from '../../typer/behandling/behandlingÅrsak';
import { Steg, stegErLåstForBehandling } from '../../typer/behandling/steg';

export type FanerMedRouter = {
    navn: FaneNavn | StønadsvilkårFaneNavn;
    path: FanePath;
    komponent: (behandlingId: string) => React.ReactNode | undefined;
    ikon?: React.ReactNode;
    erLåst?: boolean;
};

export enum FaneNavn {
    INNGANGSVILKÅR = 'Inngangsvilkår',
    VEDTAK_OG_BEREGNING = 'Vedtak og beregning',
    SIMULERING = 'Simulering',
    BREV = 'Vedtaksbrev',
    KORRIGERING_UTEN_BREV = 'Korrigering uten brev',
    REVURDER_FRA = 'Revurder fra',
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
    REVURDER_FRA = 'revurder-fra',
}

export const faneTilSteg: Record<FanePath, Steg> = {
    'revurder-fra': Steg.INNGANGSVILKÅR,
    inngangsvilkar: Steg.INNGANGSVILKÅR,
    stonadsvilkar: Steg.VILKÅR,
    'vedtak-og-beregning': Steg.BEREGNE_YTELSE,
    simulering: Steg.SIMULERING,
    brev: Steg.SEND_TIL_BESLUTTER,
};

export const isFanePath = (path: string): path is FanePath => {
    switch (path) {
        case FanePath.REVURDER_FRA:
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

export const faneErLåst = (behandling: Behandling, fanePath: FanePath) => {
    return stegErLåstForBehandling(behandling, faneTilSteg[fanePath]);
};

const revurderingFraFane = (
    behandling: Behandling,
    revurderingFraDatoEnabled: boolean
): FanerMedRouter[] => {
    if (behandling.type === BehandlingType.REVURDERING && revurderingFraDatoEnabled) {
        return [
            {
                navn: FaneNavn.REVURDER_FRA,
                path: FanePath.REVURDER_FRA,
                komponent: () => <RevurderFra />,
                ikon: <ClockIcon />,
                erLåst: faneErLåst(behandling, FanePath.REVURDER_FRA),
            },
        ];
    } else {
        return [];
    }
};

const brevfane = (behandling: Behandling): FanerMedRouter[] => {
    if (
        behandling.resultat !== BehandlingResultat.HENLAGT &&
        behandling.behandlingsårsak !== BehandlingÅrsak.KORRIGERING_UTEN_BREV
    ) {
        return [
            {
                navn: FaneNavn.BREV,
                path: FanePath.BREV,
                komponent: () => <Brev />,
                ikon: <EnvelopeClosedIcon />,
                erLåst: faneErLåst(behandling, FanePath.BREV),
            },
        ];
    } else {
        return [];
    }
};

const sendTilBeslutterUtenBrev = (behandling: Behandling): FanerMedRouter[] => {
    if (behandling.behandlingsårsak === BehandlingÅrsak.KORRIGERING_UTEN_BREV) {
        return [
            {
                navn: FaneNavn.KORRIGERING_UTEN_BREV,
                path: FanePath.BREV,
                komponent: () => <KorrigeringFane />,
                ikon: <EnvelopeClosedIcon />,
                erLåst: faneErLåst(behandling, FanePath.BREV),
            },
        ];
    } else {
        return [];
    }
};

export const hentBehandlingfaner = (
    behandling: Behandling,
    revurderingFraDatoEnabled: boolean
): FanerMedRouter[] => {
    return [
        ...revurderingFraFane(behandling, revurderingFraDatoEnabled),
        {
            navn: FaneNavn.INNGANGSVILKÅR,
            path: FanePath.INNGANGSVILKÅR,
            komponent: () => <Inngangsvilkår />,
            ikon: <PersonRectangleIcon />,
        },
        {
            navn: faneNavnStønadsvilkår[behandling.stønadstype],
            path: FanePath.STØNADSVILKÅR,
            komponent: () => <Stønadsvilkår />,
            ikon: <HouseHeartIcon />,
        },
        {
            navn: FaneNavn.VEDTAK_OG_BEREGNING,
            path: FanePath.VEDTAK_OG_BEREGNING,
            komponent: () => <VedtakOgBeregningBarnetilsyn />,
            ikon: <CalculatorIcon />,
            erLåst: faneErLåst(behandling, FanePath.VEDTAK_OG_BEREGNING),
        },
        {
            navn: FaneNavn.SIMULERING,
            path: FanePath.SIMULERING,
            komponent: () => <Simulering />,
            erLåst: faneErLåst(behandling, FanePath.SIMULERING),
        },
        ...brevfane(behandling),
        ...sendTilBeslutterUtenBrev(behandling),
    ];
};
