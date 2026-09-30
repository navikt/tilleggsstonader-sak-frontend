import { Stønadstype } from '../../../typer/behandling/behandlingTema';

export enum FaktiskMålgruppe {
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    ENSLIG_FORSØRGER = 'ENSLIG_FORSØRGER',
    GJENLEVENDE = 'GJENLEVENDE',
    ARBEIDSSØKER = 'ARBEIDSSØKER',
    AKTIVITETSPENGER = 'AKTIVITETSPENGER',
}

const faktiskeMålgrupper: Record<Stønadstype, Record<FaktiskMålgruppe, boolean>> = {
    [Stønadstype.BARNETILSYN]: {
        NEDSATT_ARBEIDSEVNE: true,
        ENSLIG_FORSØRGER: true,
        GJENLEVENDE: true,
        ARBEIDSSØKER: false,
        AKTIVITETSPENGER: true,
    },
    [Stønadstype.LÆREMIDLER]: {
        NEDSATT_ARBEIDSEVNE: true,
        ENSLIG_FORSØRGER: true,
        GJENLEVENDE: true,
        ARBEIDSSØKER: false,
        AKTIVITETSPENGER: true,
    },
    [Stønadstype.BOUTGIFTER]: {
        NEDSATT_ARBEIDSEVNE: true,
        ENSLIG_FORSØRGER: true,
        GJENLEVENDE: true,
        ARBEIDSSØKER: false,
        AKTIVITETSPENGER: true,
    },
    [Stønadstype.DAGLIG_REISE_TSO]: {
        NEDSATT_ARBEIDSEVNE: true,
        ENSLIG_FORSØRGER: true,
        GJENLEVENDE: true,
        ARBEIDSSØKER: false,
        AKTIVITETSPENGER: true,
    },

    [Stønadstype.DAGLIG_REISE_TSR]: {
        NEDSATT_ARBEIDSEVNE: false,
        ENSLIG_FORSØRGER: false,
        GJENLEVENDE: false,
        ARBEIDSSØKER: true,
        AKTIVITETSPENGER: false,
    },
    [Stønadstype.REISE_TIL_SAMLING_TSO]: {
        NEDSATT_ARBEIDSEVNE: true,
        ENSLIG_FORSØRGER: true,
        GJENLEVENDE: true,
        ARBEIDSSØKER: false,
        AKTIVITETSPENGER: true,
    },
    [Stønadstype.REISE_TIL_SAMLING_TSR]: {
        NEDSATT_ARBEIDSEVNE: false,
        ENSLIG_FORSØRGER: false,
        GJENLEVENDE: false,
        ARBEIDSSØKER: true,
        AKTIVITETSPENGER: false,
    },
    [Stønadstype.FLYTTING_TSO]: {
        NEDSATT_ARBEIDSEVNE: true,
        ENSLIG_FORSØRGER: true,
        GJENLEVENDE: true,
        ARBEIDSSØKER: false,
        AKTIVITETSPENGER: true,
    },

    [Stønadstype.FLYTTING_TSR]: {
        NEDSATT_ARBEIDSEVNE: false,
        ENSLIG_FORSØRGER: false,
        GJENLEVENDE: false,
        ARBEIDSSØKER: true,
        AKTIVITETSPENGER: false,
    },
    // TODO: avklar faktiske målgrupper for REISE_OPPSTART_AVSLUTNING_HJEMREISE
    [Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO]: {
        NEDSATT_ARBEIDSEVNE: true,
        ENSLIG_FORSØRGER: true,
        GJENLEVENDE: true,
        ARBEIDSSØKER: false,
        AKTIVITETSPENGER: true,
    },
    [Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR]: {
        NEDSATT_ARBEIDSEVNE: false,
        ENSLIG_FORSØRGER: false,
        GJENLEVENDE: false,
        ARBEIDSSØKER: true,
        AKTIVITETSPENGER: false,
    },
};

export const faktiskeMålgrupperForStønad: Record<Stønadstype, FaktiskMålgruppe[]> = Object.entries(
    faktiskeMålgrupper
).reduce(
    (prev, [stønadstype, faktiskMålgruppe]) => {
        prev[stønadstype as Stønadstype] = Object.entries(faktiskMålgruppe)
            .filter(([, skalMed]) => skalMed)
            .map(([målgruppe]) => målgruppe) as FaktiskMålgruppe[];
        return prev;
    },
    {} as Record<Stønadstype, FaktiskMålgruppe[]>
);

export const FaktiskMålgruppeTilTekst: Record<FaktiskMålgruppe, string> = {
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    ENSLIG_FORSØRGER: 'Enslig forsørger',
    GJENLEVENDE: 'Gjenlevende',
    ARBEIDSSØKER: 'Arbeidssøker',
    AKTIVITETSPENGER: 'Aktivitetspenger',
};

export const faktiskMålgruppeTilTekst = (type: FaktiskMålgruppe | '') => {
    if (type === '') return type;

    return FaktiskMålgruppeTilTekst[type];
};
