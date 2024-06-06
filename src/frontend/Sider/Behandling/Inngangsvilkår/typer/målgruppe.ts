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
    INGEN_MÅLGRUPPE = 'INGEN_MÅLGRUPPE',
}

export const MålgruppeTypeTilTekst: Record<MålgruppeType, string> = {
    AAP: 'AAP',
    UFØRETRYGD: 'Uføretrygd',
    OMSTILLINGSSTØNAD: 'Omstillingsstønad',
    OVERGANGSSTØNAD: 'Overgangsstønad',
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
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
    (option) => option.value !== MålgruppeType.INGEN_MÅLGRUPPE
);

// TODO: Endre navn på enum
// FaktiskMålgruppe brukes som navn foreløpig
// Disse verdiene er faktiske målgrupper, mens målgruppetype burde hete noe ala hovedytelse eller liknende
export enum FaktiskMålgruppe {
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    ENSLIG_FORSØRGER = 'ENSLIG_FORSØRGER',
    GJENLEVENDE = 'GJENLEVENDE',
    INGEN_MÅLGRUPPE = 'INGEN_MÅLGRUPPE',
}

export const MålgruppeTypeTilFaktiskMålgruppe: Record<MålgruppeType, FaktiskMålgruppe> = {
    AAP: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    UFØRETRYGD: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    OMSTILLINGSSTØNAD: FaktiskMålgruppe.GJENLEVENDE,
    OVERGANGSSTØNAD: FaktiskMålgruppe.ENSLIG_FORSØRGER,
    NEDSATT_ARBEIDSEVNE: FaktiskMålgruppe.NEDSATT_ARBEIDSEVNE,
    INGEN_MÅLGRUPPE: FaktiskMålgruppe.INGEN_MÅLGRUPPE,
};
