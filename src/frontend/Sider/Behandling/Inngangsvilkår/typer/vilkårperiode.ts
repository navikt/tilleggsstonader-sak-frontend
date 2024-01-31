import { Aktivitet, AktivitetType, AktivitetTypeTilTekst } from './aktivitet';
import { Målgruppe, MålgruppeType, MålgruppeTypeTilTekst } from './målgruppe';
import { Periode } from '../../../../utils/periode';

export interface Vilkårperioder {
    målgrupper: Målgruppe[];
    aktiviteter: Aktivitet[];
}

export interface VilkårPeriode extends Periode {
    id: string;
    resultat: VilkårPeriodeResultat;
    begrunnelse?: string;
    kilde: KildeVilkårsperiode;
    slettetKommentar?: string;
    sistEndret: string;
}

export enum VilkårPeriodeResultat {
    OPPFYLT = 'OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    IKKE_VURDERT = 'IKKE_VURDERT',
    SLETTET = 'SLETTET',
}

export enum KildeVilkårsperiode {
    MANUELL = 'MANUELL',
    SYSTEM = 'SYSTEM',
}

export enum SvarJaNei {
    JA = 'JA',
    JA_IMPLISITT = 'JA_IMPLISITT',
    NEI = 'NEI',
}

export const svarJaNeiMapping: Record<SvarJaNei, string> = {
    JA: 'Ja',
    JA_IMPLISITT: 'Ja',
    NEI: 'Nei',
};

export interface Vurdering {
    svar?: SvarJaNei;
    begrunnelse?: string;
}

export interface SlettVilkårperiode {
    behandlingId: string;
    kommentar: string;
}

export const vilkårperiodeTypeTilTekst: Record<MålgruppeType | AktivitetType, string> = {
    ...MålgruppeTypeTilTekst,
    ...AktivitetTypeTilTekst,
};
