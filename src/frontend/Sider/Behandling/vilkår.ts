export enum Vilkårsresultat {
    OPPFYLT = 'OPPFYLT',
    AUTOMATISK_OPPFYLT = 'AUTOMATISK_OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    IKKE_AKTUELL = 'IKKE_AKTUELL',
    IKKE_TATT_STILLING_TIL = 'IKKE_TATT_STILLING_TIL',
    SKAL_IKKE_VURDERES = 'SKAL_IKKE_VURDERES',
}

export enum Vilkårstype {
    MÅLGRUPPE = 'MÅLGRUPPE',
    MÅLGRUPPE_AAP = 'MÅLGRUPPE_AAP',
    MÅLGRUPPE_AAP_FERDIG_AVKLART = 'MÅLGRUPPE_AAP_FERDIG_AVKLART',
    AKTIVITET = 'AKTIVITET',
    AKTIVITET_TILTAK = 'AKTIVITET_TILTAK',
    AKTIVITET_UTDANNING = 'AKTIVITET_UTDANNING',
    PASS_BARN = 'PASS_BARN',
}

export type VurderingInput = Record<RegelId, { svar: SvarId | null; begrunnelse: string | null }>;

export type Begrunnelsestype = 'PÅKREVD' | 'VALGFRI' | 'UTEN';

export type SvarId = string;
export type RegelId = string;

export interface Vilkår {
    id: string;
    behandlingId: string;
    resultat: Vilkårsresultat;
    vilkårType: Vilkårstype;
    barnId?: string;
    endretAv: string;
    endretTid: string;
    vurdering: Vilkårsvurdering;
    opphavsvilkår?: Opphavsvilkår;
}

export interface Vilkårsvurdering {
    [regel: RegelId]: Delvilkårsvurdering;
}

export interface Delvilkårsvurdering {
    svar: string | null;
    begrunnelse: string | null;
    svaralternativer: Svaralternativer;
    følgerFraOverordnetValg: OverordnetValg | null;
}

interface OverordnetValg {
    regel: RegelId;
    svar: SvarId;
}

export interface Svaralternativer {
    [svaralternativ: string]: {
        begrunnelsestype: Begrunnelsestype;
    };
}

export interface Opphavsvilkår {
    behandlingId: string;
    endretTid: string;
}

interface GrunnlagHovedytelse {}

interface GrunnlagAktivitet {}

export interface GrunnlagBarn {
    ident: string;
    barnId: string;
    registergrunnlag: RegistergrunnlagBarn;
    søknadgrunnlag?: SøknadsgrunnlagBarn;
}

interface RegistergrunnlagBarn {
    navn: string;
    alder?: string;
    dødsdato?: string;
}

interface SøknadsgrunnlagBarn {}

interface VilkårGrunnlag {
    hovedytelse: GrunnlagHovedytelse;
    aktivitet: GrunnlagAktivitet;
    barn: GrunnlagBarn[];
}

export interface Vilkårsvurderinger {
    vilkårsett: Vilkår[];
    grunnlag: VilkårGrunnlag;
}
