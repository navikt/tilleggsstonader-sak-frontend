import { Aktivitet, AktivitetType, AktivitetTypeTilTekst } from './aktivitet';
import { Målgruppe, MålgruppeType, MålgruppeTypeTilTekst } from './målgruppe';
import { Registeraktivitet } from '../../../../../typer/registeraktivitet';
import { TypeRegisterYtelse } from '../../../../../typer/registerytelser';
import { Periode } from '../../../../../utils/periode';

export interface VilkårperioderResponse {
    vilkårperioder: Vilkårperioder;
    grunnlag: VilkårperioderGrunnlag | undefined;
}
export interface Vilkårperioder {
    målgrupper: Målgruppe[];
    aktiviteter: Aktivitet[];
}

export interface VilkårperioderGrunnlag {
    aktivitet: AktivitetGrunnlag;
    ytelse: YtelseGrunnlag;
    hentetInformasjon: HentetInformasjon;
}

interface AktivitetGrunnlag {
    aktiviteter: Registeraktivitet[];
}

interface YtelseGrunnlag {
    perioder: YtelseGrunnlagPeriode[];
}

export interface YtelseGrunnlagPeriode {
    type: TypeRegisterYtelse;
    fom: string;
    tom?: string;
    subtype?: SubtypeYtelseGrunnlag;
}

export enum SubtypeYtelseGrunnlag {
    AAP_FERDIG_AVKLART = 'AAP_FERDIG_AVKLART',
}

interface HentetInformasjon {
    tidspunktHentet: string;
    fom: string;
    tom: string;
}

export interface LagreVilkårperiodeResponse<T extends Aktivitet | Målgruppe | null> {
    periode: T;
    stønadsperiodeStatus: StønadsperiodeStatus;
    stønadsperiodeFeil?: string;
}

export enum StønadsperiodeStatus {
    Feil = 'Feil',
    Ok = 'Ok',
}

export interface VilkårPeriode extends Periode {
    id: string;
    resultat: VilkårPeriodeResultat;
    status: PeriodeStatus;
    begrunnelse?: string;
    kilde: KildeVilkårsperiode;
    slettetKommentar?: string;
    sistEndret: string;
    forrigeVilkårperiodeId?: string;
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
    resultat?: VilkårPeriodeResultat;
}

export interface SlettVilkårperiode {
    behandlingId: string;
    kommentar: string;
}

export const vilkårperiodeTypeTilTekst: Record<MålgruppeType | AktivitetType, string> = {
    ...MålgruppeTypeTilTekst,
    ...AktivitetTypeTilTekst,
};

export enum PeriodeStatus {
    NY = 'NY',
    ENDRET = 'ENDRET',
    UENDRET = 'UENDRET',
    SLETTET = 'SLETTET',
}
