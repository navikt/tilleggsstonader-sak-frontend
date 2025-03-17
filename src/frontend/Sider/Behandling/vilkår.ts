import { Begrunnelse, RegelId, SvarId } from '../../typer/regel';
import { PeriodeStatus } from './Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

export enum Vilkårsresultat {
    OPPFYLT = 'OPPFYLT',
    AUTOMATISK_OPPFYLT = 'AUTOMATISK_OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    IKKE_AKTUELL = 'IKKE_AKTUELL',
    IKKE_TATT_STILLING_TIL = 'IKKE_TATT_STILLING_TIL',
    SKAL_IKKE_VURDERES = 'SKAL_IKKE_VURDERES',
}

export type Vilkårtype = Inngangsvilkårtype | StønadsvilkårType;

export enum Inngangsvilkårtype {
    MÅLGRUPPE = 'MÅLGRUPPE',
    MÅLGRUPPE_AAP = 'MÅLGRUPPE_AAP',
    MÅLGRUPPE_AAP_FERDIG_AVKLART = 'MÅLGRUPPE_AAP_FERDIG_AVKLART',
    AKTIVITET = 'AKTIVITET',
    AKTIVITET_TILTAK = 'AKTIVITET_TILTAK',
    AKTIVITET_UTDANNING = 'AKTIVITET_UTDANNING',
}

export enum StønadsvilkårType {
    MIDLERTIDIG_OVERNATTING = 'MIDLERTIDIG_OVERNATTING',
    FASTE_UTGIFTER = 'FASTE_UTGIFTER',
    PASS_BARN = 'PASS_BARN',
}

export interface Vurdering {
    regelId: RegelId;
    svar?: SvarId;
    begrunnelse?: Begrunnelse;
}

export interface Vilkår {
    id: string;
    behandlingId: string;
    resultat: Vilkårsresultat;
    status: PeriodeStatus;
    vilkårType: Vilkårtype;
    barnId?: string;
    endretAv: string;
    endretTid: string;
    delvilkårsett: Delvilkår[];
    opphavsvilkår?: Opphavsvilkår;
    fom?: string;
    tom?: string;
    utgift?: number;
}

export interface Opphavsvilkår {
    behandlingId: string;
    endretTid: string;
}

export interface Delvilkår {
    resultat: Vilkårsresultat;
    vurderinger: Vurdering[];
}

export interface Vilkårsvurdering {
    vilkårsett: Vilkår[];
}

export type SvarPåVilkår = Pick<
    Vilkår,
    'id' | 'delvilkårsett' | 'behandlingId' | 'fom' | 'tom' | 'utgift'
>;

export type NyttVilkår = Pick<
    Vilkår,
    'barnId' | 'delvilkårsett' | 'vilkårType' | 'behandlingId' | 'fom' | 'tom' | 'utgift'
>;

// Brukes for nullstilling av vilkår
export type OppdaterVilkår = Pick<Vilkår, 'id' | 'behandlingId'>;

// Internt bruk av felter som kan oppdateres i komponent
export type RedigerbareVilkårfelter = Pick<Vilkår, 'delvilkårsett' | 'fom' | 'tom' | 'utgift'>;
