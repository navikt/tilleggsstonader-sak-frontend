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
}

export enum MålgruppeType {
    AAP = 'AAP',
    UFØRETRYGD = 'UFØRETRYGD',
    OMSTILLINGSSTØNAD = 'OMSTILLINGSSTØNAD',
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
    NEDSATT_ARBEIDSEVNE = 'NEDSATT_ARBEIDSEVNE',
}

export const MålgruppeTypeTilTekst: Record<MålgruppeType, string> = {
    AAP: 'AAP',
    UFØRETRYGD: 'Uføretrygd',
    OMSTILLINGSSTØNAD: 'Omstillingsstønad',
    OVERGANGSSTØNAD: 'Overgangsstønad',
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
};

export const MålgruppeTypeOptions: SelectOption[] = Object.entries(MålgruppeTypeTilTekst).map(
    ([value, label]) => ({
        value: value,
        label: label,
    })
);
