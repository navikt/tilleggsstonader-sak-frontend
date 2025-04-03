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

export const FaktiskMålgruppeTilTekst: Record<FaktiskMålgruppe, string> = {
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
    ENSLIG_FORSØRGER: 'Enslig forsørger',
    GJENLEVENDE: 'Gjenlevende',
};

type MålgruppeEllerNyFaktiskMålgruppe = FaktiskMålgruppe | MålgruppeType;

const faktiskMålgruppeOgMålgruppe: Record<MålgruppeEllerNyFaktiskMålgruppe, string> = {
    ...MålgruppeTypeTilTekst,
    ...FaktiskMålgruppeTilTekst,
};

// TODO fjern kobling til målgruppe når den ikke trengs
export const faktiskMålgruppeTilTekst = (type: MålgruppeEllerNyFaktiskMålgruppe | '') => {
    if (type === '') return type;

    return faktiskMålgruppeOgMålgruppe[type];
};

export const faktiskMålgruppeTypeOptions: SelectOption[] = Object.entries(
    FaktiskMålgruppeTilTekst
).map(([value, label]) => ({
    value: value,
    label: label,
}));
