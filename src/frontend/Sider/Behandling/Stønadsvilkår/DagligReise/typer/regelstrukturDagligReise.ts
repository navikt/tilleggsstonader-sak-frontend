import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';

export type Regelstruktur = Record<RegelIdDagligReise, RegelInfo>;

export enum RegelIdDagligReise {
    AVSTAND_OVER_SEKS_KM = 'AVSTAND_OVER_SEKS_KM',
    UNNTAK_SEKS_KM = 'UNNTAK_SEKS_KM',
    KAN_REISE_MED_OFFENTLIG_TRANSPORT = 'KAN_REISE_MED_OFFENTLIG_TRANSPORT',
    KAN_KJØRE_MED_EGEN_BIL = 'KAN_KJØRE_MED_EGEN_BIL',
}

interface RegelInfo {
    erHovedregel: boolean;
    reglerSomMåNullstilles: RegelIdDagligReise[];
    svaralternativer: SvarAlternativ[];
}

export interface SvarAlternativ {
    svarId: SvarId;
    nesteRegelId: RegelIdDagligReise | undefined;
    begrunnelseType: BegrunnelseRegel;
    tilhørendeFaktaType: TypeVilkårFakta;
}

export type TypeVilkårFakta =
    | 'DAGLIG_REISE_OFFENTLIG_TRANSPORT'
    | 'DAGLIG_REISE_PRIVAT_BIL'
    | 'DAGLIG_REISE_UBESTEMT';
