import { VilkårPeriode, Vurdering } from './vilkårperiode';

export interface Målgruppe extends VilkårPeriode {
    id: string;
    type: MålgruppeType;
    detaljer: DelvilkårMålgruppe;
}

export enum MålgruppeType {
    AAP = 'AAP',
    AAP_FERDIG_AVKLART = 'AAP_FERDIG_AVKLART',
    DAGPENGER = 'DAGPENGER',
    UFØRETRYGD = 'UFØRETRYGD',
    OMSTILLINGSSTØNAD = 'OMSTILLINGSSTØNAD',
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
}

interface DelvilkårMålgruppe {
    medlemskap: Vurdering;
}
