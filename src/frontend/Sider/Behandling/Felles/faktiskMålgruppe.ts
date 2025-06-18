import { SelectOption } from '../../../komponenter/Skjema/SelectMedOptions';

export enum FaktiskMålgruppe {
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    DAGPENGER = 'DAGPENGER',
    ENSLIG_FORSØRGER = 'ENSLIG_FORSØRGER',
    GJENLEVENDE = 'GJENLEVENDE',
}

export const FaktiskMålgruppeTilTekst: Record<FaktiskMålgruppe, string> = {
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    DAGPENGER: 'Dagpenger',
    ENSLIG_FORSØRGER: 'Enslig forsørger',
    GJENLEVENDE: 'Gjenlevende',
};

export const faktiskMålgruppeTilTekst = (type: FaktiskMålgruppe | '') => {
    if (type === '') return type;

    return FaktiskMålgruppeTilTekst[type];
};

export const faktiskMålgruppeTypeOptions: SelectOption[] = Object.entries(
    FaktiskMålgruppeTilTekst
).map(([value, label]) => ({
    value: value,
    label: label,
}));
