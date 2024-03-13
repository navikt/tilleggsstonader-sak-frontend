import { BegrunnelseRegel, BegrunnelseType, SvarId } from '../../typer/regel';

export enum Vilkårsresultat {
    OPPFYLT = 'OPPFYLT',
    AUTOMATISK_OPPFYLT = 'AUTOMATISK_OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    IKKE_AKTUELL = 'IKKE_AKTUELL',
    IKKE_TATT_STILLING_TIL = 'IKKE_TATT_STILLING_TIL',
    SKAL_IKKE_VURDERES = 'SKAL_IKKE_VURDERES',
}

export type Vilkårtype = Inngangsvilkårtype;

export enum Inngangsvilkårtype {
    MÅLGRUPPE = 'MÅLGRUPPE',
    MÅLGRUPPE_AAP = 'MÅLGRUPPE_AAP',
    MÅLGRUPPE_AAP_FERDIG_AVKLART = 'MÅLGRUPPE_AAP_FERDIG_AVKLART',
    AKTIVITET = 'AKTIVITET',
    AKTIVITET_TILTAK = 'AKTIVITET_TILTAK',
    AKTIVITET_UTDANNING = 'AKTIVITET_UTDANNING',
    PASS_BARN = 'PASS_BARN',
}

export interface Vurdering {
    regelId: string;
    svar?: SvarId;
    begrunnelse?: BegrunnelseType;
}

export interface VurderingNy {}

export interface Vilkår {
    id: string;
    behandlingId: string;
    resultat: Vilkårsresultat;
    vilkårType: Vilkårtype;
    barnId?: string;
    endretAv: string;
    endretTid: string;
    delvilkårsett: Vilkårsvurderinger;
    opphavsvilkår?: Opphavsvilkår;
}

export interface Vilkårsvurderinger {
    [key: string]: Delvilkårsvurdering;
}

export interface Delvilkårsvurdering {
    følgerFraRegel?: string;
    svar?: string;
    begrunnelse?: string;
    svaralternativer: Svaralternativer;
}

export interface Svaralternativer {
    [key: string]: Svaralternativ;
}

export interface Svaralternativ {
    begrunnelsesType: BegrunnelseRegel;
}

export interface Opphavsvilkår {
    behandlingId: string;
    endretTid: string;
}

export interface Delvilkår {
    resultat: Vilkårsresultat;
    vurderinger: Vurdering[];
}

export interface DelvilkårSvar {
    vurderinger: Vurdering[];
}

export interface DelvilkårSvarNy {
    vurderinger: VurderingNy[];
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

export interface Vilkårsvurdering {
    vilkårsett: Vilkår[];
    grunnlag: VilkårGrunnlag;
}

export type SvarPåVilkår = Pick<Vilkår, 'id' | 'delvilkårsett' | 'behandlingId'>;

export type OppdaterVilkår = Pick<Vilkår, 'id' | 'behandlingId'>;

export interface Vurderingsfeilmelding {
    [Key: string]: string;
}
