import React from 'react';

import {
    BriefcaseIcon,
    CalculatorIcon,
    CarIcon,
    EnvelopeClosedIcon,
    HouseHeartIcon,
    PersonRectangleIcon,
} from '@navikt/aksel-icons';

import Brev from './Brev/Brev';
import { UtenBrev } from './Fanemeny/UtenBrev';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import { Simulering } from './Simulering/Simulering';
import { StønadsvilkårDagligReise } from './Stønadsvilkår/DagligReise/StønadsvilkårDagligReise';
import Stønadsvilkår from './Stønadsvilkår/Stønadsvilkår';
import VedtakOgBeregningBarnetilsyn from './VedtakOgBeregning/Barnetilsyn/VedtakOgBeregningBarnetilsyn';
import { VedtakOgBeregningBoutgifter } from './VedtakOgBeregning/Boutgifter/VedtakOgBeregningBoutgifter';
import { VedtakOgBeregningDagligReise } from './VedtakOgBeregning/DagligReise/VedtakOgBeregningDagligReise';
import VedtakOgBeregningLæremidler from './VedtakOgBeregning/Læremidler/VedtakOgBeregningLæremidler';
import { StegKnapp } from '../../komponenter/Stegflyt/StegKnapp';
import { Behandling } from '../../typer/behandling/behandling';
import { BehandlingResultat } from '../../typer/behandling/behandlingResultat';
import { Stønadstype, stønadstypeTilTekst } from '../../typer/behandling/behandlingTema';
import { BehandlingÅrsak } from '../../typer/behandling/behandlingÅrsak';
import { Steg, stegErLåstForBehandling } from '../../typer/behandling/steg';
import { RammevedtakOgBeregningDagligReise } from './VedtakOgBeregning/DagligReise/innvilgeRammevedtak/RammevedtakOgBeregningDagligReise';

export type FanerMedRouter = {
    navn: FaneNavn | StønadsvilkårFaneNavn;
    path: FanePath;
    komponent: (behandlingId: string) => React.ReactNode | undefined;
    ikon?: React.ReactNode;
    erLåst?: boolean;
};

export enum FaneNavn {
    INNGANGSVILKÅR = 'Inngangsvilkår',
    VEDTAK = 'Vedtak',
    KJØRELISTE = 'Kjøreliste',
    VEDTAK_OG_BEREGNING = 'Vedtak og beregning',
    SIMULERING = 'Simulering',
    BREV = 'Vedtaksbrev',
    UTEN_BREV = 'Uten brev',
}

export enum StønadsvilkårFaneNavn {
    PASS_BARN = 'Pass barn',
    VILKÅR = 'Bolig/overnatting',
    DAGLIG_REISE = 'Daglig reise',
}

export const faneNavnStønadsvilkår: Record<
    Exclude<Stønadstype, 'LÆREMIDLER'>,
    StønadsvilkårFaneNavn
> = {
    BARNETILSYN: StønadsvilkårFaneNavn.PASS_BARN,
    BOUTGIFTER: StønadsvilkårFaneNavn.VILKÅR,
    DAGLIG_REISE_TSO: StønadsvilkårFaneNavn.DAGLIG_REISE,
    DAGLIG_REISE_TSR: StønadsvilkårFaneNavn.DAGLIG_REISE,
};

export enum FanePath {
    INNGANGSVILKÅR = 'inngangsvilkar',
    STØNADSVILKÅR = 'stonadsvilkar',
    VEDTAK = 'vedtak',
    KJØRELISTE = 'kjoreliste',
    VEDTAK_OG_BEREGNING = 'vedtak-og-beregning',
    SIMULERING = 'simulering',
    BREV = 'brev',
}

export const faneTilSteg: Record<FanePath, Steg> = {
    inngangsvilkar: Steg.INNGANGSVILKÅR,
    stonadsvilkar: Steg.VILKÅR,
    vedtak: Steg.VEDTAK,
    kjoreliste: Steg.KJØRELISTE,
    'vedtak-og-beregning': Steg.BEREGNE_YTELSE,
    simulering: Steg.SIMULERING,
    brev: Steg.SEND_TIL_BESLUTTER,
};

export const isFanePath = (path: string): path is FanePath => {
    switch (path) {
        case FanePath.INNGANGSVILKÅR:
        case FanePath.STØNADSVILKÅR:
        case FanePath.VEDTAK:
        case FanePath.KJØRELISTE:
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
        default:
            return <span>Har ikke vedtak for {stønadstypeTilTekst[behandling.stønadstype]}</span>;
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
    }
};

export const hentBehandlingfaner = (behandling: Behandling): FanerMedRouter[] => {
    return [
        {
            navn: FaneNavn.INNGANGSVILKÅR,
            path: FanePath.INNGANGSVILKÅR,
            komponent: () => <Inngangsvilkår />,
            ikon: <PersonRectangleIcon />,
        },
        ...stønadsvilkårFane(behandling),
        {
            navn: FaneNavn.VEDTAK,
            path: FanePath.VEDTAK,
            komponent: () => <RammevedtakOgBeregningDagligReise />,
            ikon: <CalculatorIcon />,
        },
        {
            navn: FaneNavn.KJØRELISTE,
            path: FanePath.KJØRELISTE,
            komponent: () => (
                <div>
                    <h3>Kjoreliste</h3>
                    <p>Her kommer det en oversikt over innsendte kjørelister som kan behandles</p>
                    <StegKnapp steg={Steg.KJØRELISTE} nesteFane={FanePath.VEDTAK_OG_BEREGNING}>
                        Fullfør vilkårsvurdering og gå videre
                    </StegKnapp>
                </div>
            ),
            ikon: <CarIcon />,
        },
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
