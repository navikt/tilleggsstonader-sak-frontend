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
    UTGIFTER_OVERNATTING = 'UTGIFTER_OVERNATTING',
    LØPENDE_UTGIFTER_EN_BOLIG = 'LØPENDE_UTGIFTER_EN_BOLIG',
    LØPENDE_UTGIFTER_TO_BOLIGER = 'LØPENDE_UTGIFTER_TO_BOLIGER',
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
    vilkårType: StønadsvilkårType;
    barnId?: string;
    endretAv: string;
    endretTid: string;
    delvilkårsett: Delvilkår[];
    opphavsvilkår?: Opphavsvilkår;
    fom?: string;
    tom?: string;
    utgift?: number;
    erFremtidigUtgift?: boolean;
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
export type RedigerbareVilkårfelter = Pick<
    Vilkår,
    'delvilkårsett' | 'fom' | 'tom' | 'utgift' | 'erFremtidigUtgift'
>;

export const erOppfylt = (vilkårsresultat: Vilkårsresultat) => {
    switch (vilkårsresultat) {
        case Vilkårsresultat.OPPFYLT:
        case Vilkårsresultat.AUTOMATISK_OPPFYLT:
            return true;
        case Vilkårsresultat.IKKE_OPPFYLT:
        case Vilkårsresultat.IKKE_AKTUELL:
        case Vilkårsresultat.IKKE_TATT_STILLING_TIL:
        case Vilkårsresultat.SKAL_IKKE_VURDERES:
            return false;
    }
};
