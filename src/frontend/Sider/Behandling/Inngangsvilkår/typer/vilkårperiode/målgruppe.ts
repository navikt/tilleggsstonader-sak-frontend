import { SvarJaNei, VilkårPeriode, Vurdering } from './vilkårperiode';
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
};

const målgrupper: Record<Stønadstype, Record<MålgruppeType, boolean>> = {
    [Stønadstype.BARNETILSYN]: {
        AAP: true,
        UFØRETRYGD: true,
        OMSTILLINGSSTØNAD: true,
        OVERGANGSSTØNAD: true,
        NEDSATT_ARBEIDSEVNE: true,
        SYKEPENGER_100_PROSENT: true,
        INGEN_MÅLGRUPPE: true,
        GJENLEVENDE_GAMMELT_REGELVERK: true,
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

export const målgruppeTypeOptionsForStønadsperiode = målgruppeTypeOptions.filter(
    (option) =>
        option.value !== MålgruppeType.INGEN_MÅLGRUPPE &&
        option.value !== MålgruppeType.SYKEPENGER_100_PROSENT
);

// TODO: Endre navn på enum
// FaktiskMålgruppe brukes som navn foreløpig
// Disse verdiene er faktiske målgrupper, mens målgruppetype burde hete noe ala hovedytelse eller liknende
export enum FaktiskMålgruppe {
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    ENSLIG_FORSØRGER = 'ENSLIG_FORSØRGER',
    GJENLEVENDE = 'GJENLEVENDE',
    SYKEPENGER_100_PROSENT = 'SYKEPENGER_100_PROSENT',
    INGEN_MÅLGRUPPE = 'INGEN_MÅLGRUPPE',
}

export const MålgruppeTypeTilFaktiskMålgruppe: Record<MålgruppeType, FaktiskMålgruppe> = {
    AAP: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    UFØRETRYGD: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    OMSTILLINGSSTØNAD: FaktiskMålgruppe.GJENLEVENDE,
    OVERGANGSSTØNAD: FaktiskMålgruppe.ENSLIG_FORSØRGER,
    NEDSATT_ARBEIDSEVNE: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    SYKEPENGER_100_PROSENT: FaktiskMålgruppe.SYKEPENGER_100_PROSENT,
    INGEN_MÅLGRUPPE: FaktiskMålgruppe.INGEN_MÅLGRUPPE,
    GJENLEVENDE_GAMMELT_REGELVERK: FaktiskMålgruppe.GJENLEVENDE,
};

export interface MålgruppeVurderinger {
    medlemskap: Vurdering | undefined;
    utgifterDekketAvAnnetRegelverk: Vurdering | undefined;
    mottarSykepengerForFulltidsstilling: Vurdering | undefined;
}

export interface SvarMålgruppe {
    svarMedlemskap: SvarJaNei | undefined;
    svarUtgifterDekketAvAnnetRegelverk: SvarJaNei | undefined;
    svarMottarSykepengerForFulltidsstilling: SvarJaNei | undefined;
}

export interface MålgruppeFaktaOgSvar extends SvarMålgruppe {
    '@type': 'MÅLGRUPPE';
}
