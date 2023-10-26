import { Begrunnelse, SvarId } from '../../typer/regel';

export enum Vilkårsresultat {
    OPPFYLT = 'OPPFYLT',
    AUTOMATISK_OPPFYLT = 'AUTOMATISK_OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    IKKE_AKTUELL = 'IKKE_AKTUELL',
    IKKE_TATT_STILLING_TIL = 'IKKE_TATT_STILLING_TIL',
    SKAL_IKKE_VURDERES = 'SKAL_IKKE_VURDERES',
}

export interface Barn {
    barnId: string;
    // søknadsgrunnlag: BarnSøknadsgrunnlag;
    registergrunnlag: BarnRegistergrunnlag;
    // barnepass?: Barnepass;
}

interface BarnRegistergrunnlag {
    navn?: string;
    fødselsdato?: string;
}

export type Vilkårtype = Inngangsvilkårtype;

export enum Inngangsvilkårtype {
    MÅLGRUPPE = 'MÅLGRUPPE',
    AKTIVITET = 'AKTIVITET',
}

export interface Vurdering {
    regelId: string;
    svar?: SvarId;
    begrunnelse?: Begrunnelse;
}
export interface Vilkår {
    id: string;
    behandlingId: string;
    resultat: Vilkårsresultat;
    vilkårType: Vilkårtype;
    barnId?: string;
    endretAv: string;
    endretTid: string;
    delvilkårsett: Delvilkår[];
    opphavsvilkår?: Opphavsvilkår;
}

export interface Opphavsvilkår {
    behandlingId: string;
    endretTid: string;
}

export interface Delvilkår {
    resultat: Vilkårsresultat;
    vurderinger: Vurdering[];
}

interface VilkårGrunnlag {}

export interface Vilkårsvurdering {
    vilkårsett: Vilkår[];
    grunnlag: VilkårGrunnlag;
}

export type SvarPåVilkår = Pick<Vilkår, 'id' | 'delvilkårsett' | 'behandlingId'>;

export type OppdaterVilkår = Pick<Vilkår, 'id' | 'behandlingId'>;

export interface Vurderingsfeilmelding {
    [Key: string]: string;
}
