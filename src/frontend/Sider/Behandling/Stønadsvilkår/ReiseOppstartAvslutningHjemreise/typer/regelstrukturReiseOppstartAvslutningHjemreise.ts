import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';

export type RegelstrukturReiseOppstartAvslutningHjemreise = Record<
    RegelIdReiseOppstartAvslutningHjemreise,
    RegelInfo
>;

export enum RegelIdReiseOppstartAvslutningHjemreise {
    KAN_REISE_MED_OFFENTLIG_TRANSPORT = 'KAN_REISE_MED_OFFENTLIG_TRANSPORT',
    KAN_REISE_MED_EGEN_BIL = 'KAN_REISE_MED_EGEN_BIL',
}

interface RegelInfo {
    erHovedregel: boolean;
    reglerSomMåNullstilles: RegelIdReiseOppstartAvslutningHjemreise[];
    svaralternativer: SvarAlternativ[];
}

export interface SvarAlternativ {
    svarId: SvarId;
    nesteRegelId: RegelIdReiseOppstartAvslutningHjemreise | undefined;
    begrunnelseType: BegrunnelseRegel;
    tilhørendeFaktaType: TypeVilkårFakta;
}

export type TypeVilkårFakta =
    | 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_OFFENTLIG_TRANSPORT'
    | 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_PRIVAT_BIL'
    | 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_UBESTEMT';
