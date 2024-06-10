import { VilkårPeriode, Vurdering } from './vilkårperiode';
import { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';

export interface Målgruppe extends VilkårPeriode {
    id: string;
    type: MålgruppeType;
    delvilkår: DelvilkårMålgruppe;
}

export interface DelvilkårMålgruppe {
    '@type': 'MÅLGRUPPE';
    medlemskap?: Vurdering;
    dekketAvAnnetRegelverk?: Vurdering;
}

export enum MålgruppeType {
    AAP = 'AAP',
    UFØRETRYGD = 'UFØRETRYGD',
    OMSTILLINGSSTØNAD = 'OMSTILLINGSSTØNAD',
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    SYKEPENGER_100_PROSENT_FOR_FULLTIDSSTILLING = 'SYKEPENGER_100_PROSENT_FOR_FULLTIDSSTILLING',
    INGEN_MÅLGRUPPE = 'INGEN_MÅLGRUPPE',
}

export const MålgruppeTypeTilTekst: Record<MålgruppeType, string> = {
    AAP: 'AAP',
    UFØRETRYGD: 'Uføretrygd',
    OMSTILLINGSSTØNAD: 'Omstillingsstønad',
    OVERGANGSSTØNAD: 'Overgangsstønad',
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    SYKEPENGER_100_PROSENT_FOR_FULLTIDSSTILLING: '100% sykepenger for fulltidsstilling',
    INGEN_MÅLGRUPPE: 'Ingen målgruppe',
};

export const målgruppeTypeTilTekst = (type: MålgruppeType | '') => {
    if (type === '') return type;

    return MålgruppeTypeTilTekst[type];
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
        option.value !== MålgruppeType.SYKEPENGER_100_PROSENT_FOR_FULLTIDSSTILLING
);

// TODO: Endre navn på enum
// FaktiskMålgruppe brukes som navn foreløpig
// Disse verdiene er faktiske målgrupper, mens målgruppetype burde hete noe ala hovedytelse eller liknende
export enum FaktiskMålgruppe {
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    ENSLIG_FORSØRGER = 'ENSLIG_FORSØRGER',
    GJENLEVENDE = 'GJENLEVENDE',
    SYKEPENGER_100_PROSENT_FOR_FULLTIDSSTILLING = 'SYKEPENGER_100_PROSENT_FOR_FULLTIDSSTILLING',
    INGEN_MÅLGRUPPE = 'INGEN_MÅLGRUPPE',
}

export const faktisktMålgruppeTilTekst: Record<FaktiskMålgruppe, string> = {
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    ENSLIG_FORSØRGER: 'Enslig forsørger',
    GJENLEVENDE: 'Gjenlevende',
    SYKEPENGER_100_PROSENT_FOR_FULLTIDSSTILLING:
        '100% sykepenger gir ikke rett til tilleggsstønader',
    INGEN_MÅLGRUPPE: 'Ingen målgruppe',
};

export const MålgruppeTypeTilFaktiskMålgruppe: Record<MålgruppeType, FaktiskMålgruppe> = {
    AAP: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    UFØRETRYGD: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    OMSTILLINGSSTØNAD: FaktiskMålgruppe.GJENLEVENDE,
    OVERGANGSSTØNAD: FaktiskMålgruppe.ENSLIG_FORSØRGER,
    NEDSATT_ARBEIDSEVNE: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    SYKEPENGER_100_PROSENT_FOR_FULLTIDSSTILLING:
        FaktiskMålgruppe.SYKEPENGER_100_PROSENT_FOR_FULLTIDSSTILLING,
    INGEN_MÅLGRUPPE: FaktiskMålgruppe.INGEN_MÅLGRUPPE,
};
