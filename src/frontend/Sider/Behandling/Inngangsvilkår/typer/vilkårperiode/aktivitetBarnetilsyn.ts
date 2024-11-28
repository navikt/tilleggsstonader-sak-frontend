import { AktivitetType } from './aktivitet';
import { SvarJaNei, VilkårPeriode, Vurdering } from './vilkårperiode';

export interface AktivitetBarnetilsyn extends VilkårPeriode {
    id: string;
    type: AktivitetType;
    kildeId?: string;
    faktaOgVurderinger: AktivitetBarnetilsynFaktaOgVurderinger;
}

export interface AktivitetBarnetilsynFaktaOgVurderinger {
    '@type': 'AKTIVITET_BARNETILSYN';
    aktivitetsdager: number | undefined;
    lønnet: Vurdering | undefined;
}

export interface AktivitetBarnetilsynFaktaOgSvar {
    '@type': 'AKTIVITET_BARNETILSYN';
    aktivitetsdager: number | undefined;
    svarLønnet: SvarJaNei | undefined;
}
