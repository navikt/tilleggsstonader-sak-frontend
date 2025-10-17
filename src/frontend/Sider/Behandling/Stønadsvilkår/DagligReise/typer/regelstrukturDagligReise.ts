import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';

export type Regelstruktur = Record<RegelIdDagligReise, RegelInfo>;

export enum RegelIdDagligReise {
    AVSTAND_OVER_SEKS_KM = 'AVSTAND_OVER_SEKS_KM',
    UNNTAK_SEKS_KM = 'UNNTAK_SEKS_KM',
    KAN_BRUKER_REISE_MED_OFFENTLIG_TRANSPORT = 'KAN_BRUKER_REISE_MED_OFFENTLIG_TRANSPORT',
    KAN_BRUKER_KJØRE_SELV = 'KAN_BRUKER_KJØRE_SELV',
}

export interface RegelInfo {
    erHovedregel: boolean;
    reglerSomMåNullstillesVedEndring: RegelIdDagligReise[];
    svaralternativer: SvarAlternativ[];
}

export interface SvarAlternativ {
    svarId: SvarId;
    nesteRegelId: RegelIdDagligReise;
    begrunnelseType: BegrunnelseRegel;
    triggerFakta: TypeVilkårFakta | undefined;
}

export type TypeVilkårFakta = 'DAGLIG_REISE_OFFENTLIG_TRANSPORT' | 'DAGLIG_REISE_PRIVAT_BIL';
