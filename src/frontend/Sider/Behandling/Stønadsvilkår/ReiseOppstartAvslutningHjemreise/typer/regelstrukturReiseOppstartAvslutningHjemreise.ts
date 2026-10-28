import { BegrunnelseRegel, SvarId } from '../../../../../typer/regel';

export interface RegelstrukturROAH {
    oppstart: Regelstruktur;
    avslutning: Regelstruktur;
    hjemreise: Regelstruktur;
}

export enum RegelIdROAH {
    ROAH_HAR_UTGIFTER_TIL_REISEN = 'ROAH_HAR_UTGIFTER_TIL_REISEN',
    ROAH_KAN_REISE_MED_OFFENTLIG_TRANSPORT = 'ROAH_KAN_REISE_MED_OFFENTLIG_TRANSPORT',
    ROAH_HAR_DOKUMENTERTE_UTGIFTER_TIL_REISEN = 'ROAH_HAR_DOKUMENTERTE_UTGIFTER_TIL_REISEN',
    ROAH_KAN_BENYTTE_PRIVAT_BIL = 'ROAH_KAN_BENYTTE_PRIVAT_BIL',
    ROAH_BENYTTET_TAXI = 'ROAH_BENYTTET_TAXI',
    ROAH_HJEMREISE_INNENFOR_NORMALT_ANTALL = 'ROAH_HJEMREISE_INNENFOR_NORMALT_ANTALL',
    ROAH_HJEMREISE_BEHOV_FLERE_REISER = 'ROAH_HJEMREISE_BEHOV_FLERE_REISER',
}

export interface RegelInfo {
    erHovedregel: boolean;
    reglerSomMåNullstilles: RegelIdROAH[];
    svaralternativer: SvarAlternativ[];
}

export type Regelstruktur = Partial<Record<RegelIdROAH, RegelInfo>>;

export interface SvarAlternativ {
    svarId: SvarId;
    nesteRegelId: RegelIdROAH | undefined;
    begrunnelseType: BegrunnelseRegel;
    tilhørendeFaktaType: TypeVilkårFakta;
}

export type TypeVilkårFakta =
    | 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_OFFENTLIG_TRANSPORT'
    | 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_PRIVAT_BIL'
    | 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_UBESTEMT';

export const regelIdTilSpørsmålROAH: Record<RegelIdROAH, string> = {
    ROAH_HAR_UTGIFTER_TIL_REISEN: 'Har bruker utgifter til reisen?',
    ROAH_KAN_REISE_MED_OFFENTLIG_TRANSPORT:
        'Har bruker mulighet til å reise med offentlig transport?',
    ROAH_HAR_DOKUMENTERTE_UTGIFTER_TIL_REISEN: 'Har bruker dokumenterte utgifter til reisen?',
    ROAH_KAN_BENYTTE_PRIVAT_BIL: 'Kan bruker benytte seg av privat bil?',
    ROAH_BENYTTET_TAXI: 'Benyttet bruker taxi?',
    ROAH_HJEMREISE_INNENFOR_NORMALT_ANTALL: 'Er søker innenfor normalt antall hjemreiser per år?',
    ROAH_HJEMREISE_BEHOV_FLERE_REISER:
        'Har bruker behov for flere hjemreiser, og er behovet tilfredsstillende dokumentert?',
};
