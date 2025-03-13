import { MålgruppeType } from './målgruppe';
import { SvarJaNei, VilkårPeriode, Vurdering } from './vilkårperiode';

export interface MålgruppeLæremidler extends VilkårPeriode {
    type: MålgruppeType;
    faktaOgVurderinger: MålgruppeLæremidlerVurderinger;
}

export interface MålgruppeLæremidlerVurderinger {
    medlemskap: Vurdering | undefined;
    utgifterDekketAvAnnetRegelverk: Vurdering | undefined;
}

export interface SvarMålgruppeLæremidler {
    svarMedlemskap: SvarJaNei | undefined;
    svarUtgifterDekketAvAnnetRegelverk: SvarJaNei | undefined;
}

export interface MålgruppeLæremidlerFaktaOgSvar extends SvarMålgruppeLæremidler {
    '@type': 'MÅLGRUPPE';
}
