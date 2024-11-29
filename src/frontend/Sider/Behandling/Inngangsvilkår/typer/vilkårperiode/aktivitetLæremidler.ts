import { AktivitetType } from './aktivitet';
import { SvarJaNei, VilkårPeriode, Vurdering } from './vilkårperiode';

export interface AktivitetLæremidler extends VilkårPeriode {
    id: string;
    type: AktivitetTypeLæremidler;
    kildeId?: string;
    faktaOgVurderinger: AktivitetLæremidlerFaktaOgVurderinger;
}

export type AktivitetTypeLæremidler =
    | AktivitetType.TILTAK
    | AktivitetType.UTDANNING
    | AktivitetType.INGEN_AKTIVITET;

export interface AktivitetLæremidlerFaktaOgVurderinger {
    '@type': 'AKTIVITET_LÆREMIDLER';
    prosent: number | undefined;
    studienivå: Studienivå | undefined;
    harUtgifter: Vurdering | undefined;
}

export interface AktivitetLæremidlerFaktaOgSvar {
    '@type': 'AKTIVITET_LÆREMIDLER';
    prosent: number | undefined;
    studienivå: Studienivå | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
}

export enum Studienivå {
    HØYERE_UTDANNING = 'HØYERE_UTDANNING',
    VIDEREGÅENDE = 'VIDEREGÅENDE',
}
