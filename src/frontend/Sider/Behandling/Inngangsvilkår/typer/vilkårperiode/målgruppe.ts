import {
    SvarJaNei,
    VilkårPeriode,
    Vurdering,
    VurderingMedGammelManglerData,
} from './vilkårperiode';
import { SelectOption } from '../../../../../komponenter/Skjema/SelectMedOptions';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';

export interface Målgruppe extends VilkårPeriode {
    type: MålgruppeType;
    faktaOgVurderinger: MålgruppeVurderinger;
}

export enum MålgruppeType {
    AAP = 'AAP',
    UFØRETRYGD = 'UFØRETRYGD',
    OMSTILLINGSSTØNAD = 'OMSTILLINGSSTØNAD',
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    SYKEPENGER_100_PROSENT = 'SYKEPENGER_100_PROSENT',
    INGEN_MÅLGRUPPE = 'INGEN_MÅLGRUPPE',
    GJENLEVENDE_GAMMELT_REGELVERK = 'GJENLEVENDE_GAMMELT_REGELVERK', // Ikke støttet i backend, brukes kun for å vise feilmelding om manglende støtte ved valg av denne
    DAGPENGER = 'DAGPENGER',
    KVALIFISERINGSSTØNAD = 'KVALIFISERINGSSTØNAD',
    TILTAKSPENGER = 'TILTAKSPENGER',
}

export const MålgruppeTypeTilTekst: Record<MålgruppeType, string> = {
    AAP: 'AAP',
    UFØRETRYGD: 'Uføretrygd',
    OMSTILLINGSSTØNAD: 'Omstillingsstønad',
    OVERGANGSSTØNAD: 'Overgangsstønad',
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    SYKEPENGER_100_PROSENT: '100% sykepenger',
    INGEN_MÅLGRUPPE: 'Ingen målgruppe',
    GJENLEVENDE_GAMMELT_REGELVERK: 'Gjenlevende - gammelt regelverk',
    DAGPENGER: 'Dagpenger',
    KVALIFISERINGSSTØNAD: 'Kvalifiseringsstønad',
    TILTAKSPENGER: 'Tiltakspenger',
};

const målgrupper: Record<Stønadstype, Record<MålgruppeType, boolean>> = {
    [Stønadstype.BARNETILSYN]: {
        AAP: true,
        UFØRETRYGD: true,
        OMSTILLINGSSTØNAD: true,
        OVERGANGSSTØNAD: true,
        NEDSATT_ARBEIDSEVNE: true,
        SYKEPENGER_100_PROSENT: false,
        INGEN_MÅLGRUPPE: true,
        GJENLEVENDE_GAMMELT_REGELVERK: true,
        DAGPENGER: false,
        KVALIFISERINGSSTØNAD: false,
        TILTAKSPENGER: false,
    },
    [Stønadstype.LÆREMIDLER]: {
        AAP: true,
        UFØRETRYGD: true,
        OMSTILLINGSSTØNAD: true,
        OVERGANGSSTØNAD: true,
        NEDSATT_ARBEIDSEVNE: true,
        SYKEPENGER_100_PROSENT: false,
        INGEN_MÅLGRUPPE: true,
        GJENLEVENDE_GAMMELT_REGELVERK: true,
        DAGPENGER: false,
        KVALIFISERINGSSTØNAD: false,
        TILTAKSPENGER: false,
    },
    [Stønadstype.BOUTGIFTER]: {
        AAP: true,
        UFØRETRYGD: true,
        OMSTILLINGSSTØNAD: true,
        OVERGANGSSTØNAD: true,
        NEDSATT_ARBEIDSEVNE: true,
        SYKEPENGER_100_PROSENT: false,
        INGEN_MÅLGRUPPE: true,
        GJENLEVENDE_GAMMELT_REGELVERK: true,
        DAGPENGER: false,
        KVALIFISERINGSSTØNAD: false,
        TILTAKSPENGER: false,
    },
    [Stønadstype.DAGLIG_REISE_TSO]: {
        AAP: true,
        UFØRETRYGD: true,
        OMSTILLINGSSTØNAD: true,
        OVERGANGSSTØNAD: true,
        NEDSATT_ARBEIDSEVNE: true,
        INGEN_MÅLGRUPPE: true,
        GJENLEVENDE_GAMMELT_REGELVERK: true,
        SYKEPENGER_100_PROSENT: false,
        DAGPENGER: false,
        KVALIFISERINGSSTØNAD: false,
        TILTAKSPENGER: false,
    },

    [Stønadstype.DAGLIG_REISE_TSR]: {
        DAGPENGER: true,
        KVALIFISERINGSSTØNAD: true,
        TILTAKSPENGER: true,
        INGEN_MÅLGRUPPE: true,
        AAP: false,
        UFØRETRYGD: false,
        OMSTILLINGSSTØNAD: false,
        OVERGANGSSTØNAD: false,
        NEDSATT_ARBEIDSEVNE: false,
        SYKEPENGER_100_PROSENT: false,
        GJENLEVENDE_GAMMELT_REGELVERK: false,
    },
};

export const målgrupperForStønad: Record<Stønadstype, MålgruppeType[]> = Object.entries(
    målgrupper
).reduce(
    (prev, [stønadstype, målgruppe]) => {
        prev[stønadstype as Stønadstype] = Object.entries(målgruppe)
            .filter(([, skalMed]) => skalMed)
            .map(([målgruppe]) => målgruppe) as MålgruppeType[];
        return prev;
    },
    {} as Record<Stønadstype, MålgruppeType[]>
);

export const målgruppeTilYtelsestypeTekst = (type: MålgruppeType) => {
    switch (type) {
        case MålgruppeType.NEDSATT_ARBEIDSEVNE:
        case MålgruppeType.INGEN_MÅLGRUPPE:
            return undefined;
        default:
            return MålgruppeTypeTilTekst[type];
    }
};

export const målgruppeTypeTilTekst = (type: MålgruppeType | '') => {
    if (type === '') return type;

    return MålgruppeTypeTilTekst[type];
};

export const målgruppeTypeOptionsForStønad = (stønadstype: Stønadstype): SelectOption[] => {
    return målgrupperForStønad[stønadstype].map((type) => ({
        value: type,
        label: målgruppeTypeTilTekst(type),
    }));
};
export const målgruppeTypeOptions: SelectOption[] = Object.entries(MålgruppeTypeTilTekst).map(
    ([value, label]) => ({
        value: value,
        label: label,
    })
);

export const målgruppeTypeOptionsForVedtaksperiode = målgruppeTypeOptions.filter(
    (option) =>
        option.value !== MålgruppeType.INGEN_MÅLGRUPPE &&
        option.value !== MålgruppeType.SYKEPENGER_100_PROSENT
);

export interface MålgruppeVurderinger {
    medlemskap: Vurdering | undefined;
    utgifterDekketAvAnnetRegelverk: Vurdering | undefined;
    mottarSykepengerForFulltidsstilling: VurderingMedGammelManglerData | undefined;
}

export interface SvarMålgruppe {
    svarMedlemskap: SvarJaNei | undefined;
    svarUtgifterDekketAvAnnetRegelverk: SvarJaNei | undefined;
    svarMottarSykepengerForFulltidsstilling: SvarJaNei | undefined | 'GAMMEL_MANGLER_DATA';
}

export interface MålgruppeFaktaOgSvar extends SvarMålgruppe {
    '@type': 'MÅLGRUPPE';
}
