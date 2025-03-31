import { SelectOption } from '../../../komponenter/Skjema/SelectMedOptions';

export enum NyFaktiskMålgruppe {
    AAP = 'AAP',
    UFØRETRYGD = 'UFØRETRYGD',
    OMSTILLINGSSTØNAD = 'OMSTILLINGSSTØNAD',
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
}

const typeTilTekst: Record<NyFaktiskMålgruppe, string> = {
    AAP: 'AAP',
    UFØRETRYGD: 'Uføretrygd',
    OMSTILLINGSSTØNAD: 'Omstillingsstønad',
    OVERGANGSSTØNAD: 'Overgangsstønad',
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
};

export const nyFaktiskMålgruppeTilTekst = (type: NyFaktiskMålgruppe | '') => {
    if (type === '') return type;

    return typeTilTekst[type];
};

export const nyFaktiskMålgruppeTypeOptions: SelectOption[] = Object.entries(typeTilTekst).map(
    ([value, label]) => ({
        value: value,
        label: label,
    })
);
