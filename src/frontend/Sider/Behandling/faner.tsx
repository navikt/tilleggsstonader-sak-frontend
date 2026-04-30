import React from 'react';

import {
    BriefcaseIcon,
    CalculatorIcon,
    CarIcon,
    EnvelopeClosedIcon,
    HouseHeartIcon,
    PersonRectangleIcon,
} from '@navikt/aksel-icons';

import { Brev } from './Brev/Brev';
import { UtenBrev } from './Fanemeny/UtenBrev';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import { FullførKjørelisteFane } from './Kjøreliste/FullførKjørelisteFane';
import { KjørelisteFane } from './Kjøreliste/KjørelisteFane';
import { Simulering } from './Simulering/Simulering';
import { StønadsvilkårDagligReise } from './Stønadsvilkår/DagligReise/StønadsvilkårDagligReise';
import { StønadsvilkårReiseTilSamling } from './Stønadsvilkår/ReiseTilSamling/StønadsvilkårReiseTilSamling';
import Stønadsvilkår from './Stønadsvilkår/Stønadsvilkår';
import VedtakOgBeregningBarnetilsyn from './VedtakOgBeregning/Barnetilsyn/VedtakOgBeregningBarnetilsyn';
import { VedtakOgBeregningBoutgifter } from './VedtakOgBeregning/Boutgifter/VedtakOgBeregningBoutgifter';
import { BeregningFaneDagligReise } from './VedtakOgBeregning/DagligReise/BeregningFane/BeregningFaneDagligReise';
import { VedtakOgBeregningDagligReise } from './VedtakOgBeregning/DagligReise/VedtakOgBeregningDagligReise';
import VedtakOgBeregningLæremidler from './VedtakOgBeregning/Læremidler/VedtakOgBeregningLæremidler';
import { VedtakOgBeregningReiseTilSamling } from './VedtakOgBeregning/ReiseTilSamling/VedtakOgBeregningReiseTilSamling';
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
    UTEN_BREV = 'Uten brev',

    // Faner som tilhører daglig reise
    VEDTAK = 'Vedtak',
    KJØRELISTE = 'Kjøreliste',
    BEREGNING = 'Beregning',
    FULLFØR_KJØRELISTE = 'Fullfør kjøreliste',
}

export enum StønadsvilkårFaneNavn {
    PASS_BARN = 'Pass barn',
    VILKÅR = 'Bolig/overnatting',
    DAGLIG_REISE = 'Daglige reiser',
    REISE_TIL_SAMLING = 'Samling',
}

export const faneNavnStønadsvilkår: Record<
    Exclude<Stønadstype, 'LÆREMIDLER'>,
    StønadsvilkårFaneNavn
> = {
    BARNETILSYN: StønadsvilkårFaneNavn.PASS_BARN,
    BOUTGIFTER: StønadsvilkårFaneNavn.VILKÅR,
    DAGLIG_REISE_TSO: StønadsvilkårFaneNavn.DAGLIG_REISE,
    DAGLIG_REISE_TSR: StønadsvilkårFaneNavn.DAGLIG_REISE,
    REISE_TIL_SAMLING_TSO: StønadsvilkårFaneNavn.REISE_TIL_SAMLING,
};

export enum FanePath {
    INNGANGSVILKÅR = 'inngangsvilkar',
    STØNADSVILKÅR = 'stonadsvilkar',
    VEDTAK_OG_BEREGNING = 'vedtak-og-beregning',
    SIMULERING = 'simulering',
    BREV = 'brev',

    // Faner som tilhører daglig reise
    KJØRELISTE = 'kjoreliste',
    BEREGNING = 'beregning',
    FULLFØR_KJØRELISTE = 'fullfor-kjoreliste',
}

export const faneTilSteg: Record<FanePath, Steg> = {
    inngangsvilkar: Steg.INNGANGSVILKÅR,
    stonadsvilkar: Steg.VILKÅR,
    'vedtak-og-beregning': Steg.BEREGNE_YTELSE,
    simulering: Steg.SIMULERING,
    brev: Steg.SEND_TIL_BESLUTTER,

    kjoreliste: Steg.KJØRELISTE,
    beregning: Steg.BEREGNING,
    'fullfor-kjoreliste': Steg.FULLFØR_KJØRELISTE,
};

export const stegTilFane = (steg: Steg): FanePath => {
    switch (steg) {
        case Steg.INNGANGSVILKÅR:
            return FanePath.INNGANGSVILKÅR;
        case Steg.VILKÅR:
            return FanePath.STØNADSVILKÅR;
        case Steg.BEREGNE_YTELSE:
            return FanePath.VEDTAK_OG_BEREGNING;
        case Steg.SIMULERING:
            return FanePath.SIMULERING;
        case Steg.SEND_TIL_BESLUTTER:
            return FanePath.BREV;
        case Steg.KJØRELISTE:
            return FanePath.KJØRELISTE;
        case Steg.BEREGNING:
            return FanePath.BEREGNING;
        case Steg.FULLFØR_KJØRELISTE:
            return FanePath.FULLFØR_KJØRELISTE;

        default:
            return FanePath.INNGANGSVILKÅR;
    }
};

export const isFanePath = (path: string): path is FanePath => {
    switch (path) {
        case FanePath.INNGANGSVILKÅR:
        case FanePath.STØNADSVILKÅR:
        case FanePath.VEDTAK_OG_BEREGNING:
        case FanePath.SIMULERING:
        case FanePath.BREV:
        case FanePath.KJØRELISTE:
        case FanePath.BEREGNING:
        case FanePath.FULLFØR_KJØRELISTE:
            return true;
        default:
            return false;
    }
};

export const faneErLåst = (behandling: Behandling, fanePath: FanePath) => {
    return stegErLåstForBehandling(behandling, faneTilSteg[fanePath]);
};

const årsakUtenBrev = (behandling: Behandling) =>
    behandling.behandlingsårsak === BehandlingÅrsak.KORRIGERING_UTEN_BREV ||
    behandling.behandlingsårsak === BehandlingÅrsak.MANUELT_OPPRETTET_UTEN_BREV;

const brevfane = (behandling: Behandling): FanerMedRouter[] => {
    if (behandling.resultat !== BehandlingResultat.HENLAGT && !årsakUtenBrev(behandling)) {
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
    if (årsakUtenBrev(behandling)) {
        return [
            {
                navn: FaneNavn.UTEN_BREV,
                path: FanePath.BREV,
                komponent: () => <UtenBrev />,
                ikon: <EnvelopeClosedIcon />,
                erLåst: faneErLåst(behandling, FanePath.BREV),
            },
        ];
    } else {
        return [];
    }
};

export const vedtakForBehandling = (behandling: Behandling): React.ReactNode => {
    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return <VedtakOgBeregningBarnetilsyn />;
        case Stønadstype.LÆREMIDLER:
            return <VedtakOgBeregningLæremidler />;
        case Stønadstype.BOUTGIFTER:
            return <VedtakOgBeregningBoutgifter />;
        case Stønadstype.DAGLIG_REISE_TSO:
            return <VedtakOgBeregningDagligReise />;
        case Stønadstype.DAGLIG_REISE_TSR:
            return <VedtakOgBeregningDagligReise />;
        case Stønadstype.REISE_TIL_SAMLING_TSO:
            return <VedtakOgBeregningReiseTilSamling />;
    }
};

const stønadsvilkårFane = (behandling: Behandling): FanerMedRouter[] => {
    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return [
                {
                    navn: faneNavnStønadsvilkår[behandling.stønadstype],
                    path: FanePath.STØNADSVILKÅR,
                    komponent: () => <Stønadsvilkår stønadstype={Stønadstype.BARNETILSYN} />,
                    ikon: <HouseHeartIcon />,
                },
            ];
        case Stønadstype.BOUTGIFTER:
            return [
                {
                    navn: faneNavnStønadsvilkår[behandling.stønadstype],
                    path: FanePath.STØNADSVILKÅR,
                    komponent: () => <Stønadsvilkår stønadstype={Stønadstype.BOUTGIFTER} />,
                    ikon: <HouseHeartIcon />,
                },
            ];
        case Stønadstype.LÆREMIDLER:
            return [];
        case Stønadstype.DAGLIG_REISE_TSO:
            return [
                {
                    navn: faneNavnStønadsvilkår[behandling.stønadstype],
                    path: FanePath.STØNADSVILKÅR,
                    komponent: () => <StønadsvilkårDagligReise />,
                    ikon: <BriefcaseIcon />,
                },
            ];
        case Stønadstype.DAGLIG_REISE_TSR:
            return [
                {
                    navn: faneNavnStønadsvilkår[behandling.stønadstype],
                    path: FanePath.STØNADSVILKÅR,
                    komponent: () => <StønadsvilkårDagligReise />,
                    ikon: <BriefcaseIcon />,
                },
            ];
        case Stønadstype.REISE_TIL_SAMLING_TSO:
            return [
                {
                    navn: faneNavnStønadsvilkår[behandling.stønadstype],
                    path: FanePath.STØNADSVILKÅR,
                    komponent: () => <StønadsvilkårReiseTilSamling />,
                    ikon: <BriefcaseIcon />,
                },
            ];
    }
};

export const hentBehandlingfaner = (behandling: Behandling): FanerMedRouter[] => {
    if (behandling.type === BehandlingType.KJØRELISTE) {
        return kjørelistebehandlingFaner(behandling);
    }

    return [
        {
            navn: FaneNavn.INNGANGSVILKÅR,
            path: FanePath.INNGANGSVILKÅR,
            komponent: () => <Inngangsvilkår />,
            ikon: <PersonRectangleIcon />,
        },
        ...stønadsvilkårFane(behandling),
        {
            navn: FaneNavn.VEDTAK_OG_BEREGNING,
            path: FanePath.VEDTAK_OG_BEREGNING,
            komponent: () => vedtakForBehandling(behandling),
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

const kjørelistebehandlingFaner = (behandling: Behandling): FanerMedRouter[] => {
    return [
        {
            navn: FaneNavn.KJØRELISTE,
            path: FanePath.KJØRELISTE,
            komponent: () => <KjørelisteFane />,
            ikon: <CarIcon />,
        },
        {
            navn: FaneNavn.BEREGNING,
            path: FanePath.BEREGNING,
            komponent: () => <BeregningFaneDagligReise />,
            ikon: <CalculatorIcon />,
            erLåst: faneErLåst(behandling, FanePath.VEDTAK_OG_BEREGNING),
        },
        {
            navn: FaneNavn.SIMULERING,
            path: FanePath.SIMULERING,
            komponent: () => <Simulering />,
            erLåst: faneErLåst(behandling, FanePath.SIMULERING),
        },
        {
            navn: FaneNavn.FULLFØR_KJØRELISTE,
            path: FanePath.FULLFØR_KJØRELISTE,
            komponent: () => <FullførKjørelisteFane />,
            ikon: <EnvelopeClosedIcon />,
            erLåst: faneErLåst(behandling, FanePath.FULLFØR_KJØRELISTE),
        },
    ];
};
