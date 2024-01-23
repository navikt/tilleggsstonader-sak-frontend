import { VilkårPeriode, Vurdering } from './vilkårperiode';

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

export const målgruppeTypeTilTekst: Record<MålgruppeType, string> = {
    AAP: 'AAP',
    UFØRETRYGD: 'Uføretrygd',
    OMSTILLINGSSTØNAD: 'Omstillingsstønad',
    OVERGANGSSTØNAD: 'Overgangsstønad',
    NEDSATT_ARBEIDSEVNE: 'Nedsatt arbeidsevne',
};
