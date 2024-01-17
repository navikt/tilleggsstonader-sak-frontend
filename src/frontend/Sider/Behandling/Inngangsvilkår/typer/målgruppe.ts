import { SvarJaNei, VilkårPeriode } from './vilkårperiode';

export interface Målgruppe extends VilkårPeriode {
    id: string;
    type: MålgruppeType;
    delvilkår: DelvilkårMålgruppe;
}

export enum MålgruppeType {
    AAP = 'AAP',
    AAP_FERDIG_AVKLART = 'AAP_FERDIG_AVKLART',
    DAGPENGER = 'DAGPENGER',
    UFØRETRYGD = 'UFØRETRYGD',
    OMSTILLINGSSTØNAD = 'OMSTILLINGSSTØNAD',
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
}

export interface DelvilkårMålgruppe {
    '@type': 'MÅLGRUPPE';
    medlemskap: SvarJaNei;
}
