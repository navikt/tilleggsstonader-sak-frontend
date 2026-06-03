import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';

export type RegelstrukturReiseTilSamling = Record<RegelIdReiseTilSamling, RegelInfo>;

export enum RegelIdReiseTilSamling {
    AVSTAND_OVER_TRETTI_KM = 'AVSTAND_OVER_TRETTI_KM',
    KAN_REISE_MED_OFFENTLIG_TRANSPORT = 'KAN_REISE_MED_OFFENTLIG_TRANSPORT',
    DOKUMENTERTE_UTGIFTER = 'DOKUMENTERTE_UTGIFTER',
    KAN_REISE_MED_EGEN_BIL = 'KAN_REISE_MED_EGEN_BIL',
    DEKKET_AV_ANNET_STIPEND = 'DEKKET_AV_ANNET_STIPEND',
}

interface RegelInfo {
    erHovedregel: boolean;
    reglerSomMåNullstilles: RegelIdReiseTilSamling[];
    svaralternativer: SvarAlternativ[];
}

export interface SvarAlternativ {
    svarId: SvarId;
    nesteRegelId: RegelIdReiseTilSamling | undefined;
    begrunnelseType: BegrunnelseRegel;
    tilhørendeFaktaType: TypeVilkårFakta;
}

export type TypeVilkårFakta =
    | 'REISE_TIL_SAMLING_OFFENTLIG_TRANSPORT'
    | 'REISE_TIL_SAMLING_PRIVAT_BIL'
    | 'REISE_TIL_SAMLING_UBESTEMT';
