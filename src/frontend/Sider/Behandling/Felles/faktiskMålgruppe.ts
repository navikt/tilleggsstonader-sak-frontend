import { SelectOption } from '../../../komponenter/Skjema/SelectMedOptions';
import {
    MålgruppeType,
    MålgruppeTypeTilTekst,
} from '../Inngangsvilkår/typer/vilkårperiode/målgruppe';

export enum FaktiskMålgruppe {
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
    ENSLIG_FORSØRGER = 'ENSLIG_FORSØRGER',
    GJENLEVENDE = 'GJENLEVENDE',
}

export const faktiskMålgruppeTilTekst: Record<FaktiskMålgruppe, string> = {
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    ENSLIG_FORSØRGER: 'Enslig forsørger',
    GJENLEVENDE: 'Gjenlevende',
};

type MålgruppeEllerNyFaktiskMålgruppe = FaktiskMålgruppe | MålgruppeType;

const nyFaktiskMålgruppeOgMålgruppe: Record<MålgruppeEllerNyFaktiskMålgruppe, string> = {
    ...MålgruppeTypeTilTekst,
    ...faktiskMålgruppeTilTekst,
};

// TODO fjern kobling til målgruppe når den ikke trengs
export const nyFaktiskMålgruppeTilTekst = (type: MålgruppeEllerNyFaktiskMålgruppe | '') => {
    if (type === '') return type;

    return nyFaktiskMålgruppeOgMålgruppe[type];
};

export const nyFaktiskMålgruppeTypeOptions: SelectOption[] = Object.entries(
    faktiskMålgruppeTilTekst
).map(([value, label]) => ({
    value: value,
    label: label,
}));
