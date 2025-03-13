import { MålgruppeType } from './målgruppe';
import { SvarJaNei, VilkårPeriode, Vurdering } from './vilkårperiode';

export interface MålgruppeGenerell extends VilkårPeriode {
    type: MålgruppeType;
    faktaOgVurderinger: MålgruppeGenerellVurderinger;
}

export interface MålgruppeGenerellVurderinger {
    medlemskap: Vurdering | undefined;
    utgifterDekketAvAnnetRegelverk: Vurdering | undefined;
}

export interface SvarMålgruppeGenerell {
    svarMedlemskap: SvarJaNei | undefined;
    svarUtgifterDekketAvAnnetRegelverk: SvarJaNei | undefined;
}

export interface MålgruppeGenerellFaktaOgSvar extends SvarMålgruppeGenerell {
    '@type': 'MÅLGRUPPE';
}
