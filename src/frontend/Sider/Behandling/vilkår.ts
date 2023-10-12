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

export type Vilkårtype = Inngangsvilkår;

export enum Inngangsvilkår {
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
    vilkårtype: Vilkårtype;
    barnId?: string;
    endretAv: string;
    endretTid: string;
    delvilkårsett: Delvilkår[];
    // opphavsvilkår?: Opphavsvilkår;
}

export interface Delvilkår {
    resultat: Vilkårsresultat;
    vurderinger: Vurdering[];
}

export type SvarPåVilkårsvurdering = Pick<Vilkår, 'id' | 'delvilkårsett' | 'behandlingId'>;
