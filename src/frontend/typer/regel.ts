import { Vilkårtype } from '../Sider/Behandling/vilkår';

/*
 * Regeltreet er bygd opp av regler og tilhørende svaralternativer. Svaralternativet kan igjen kan ha nye regler knytta til seg.
 *
 * Strukturen til treet defineres ved å angi regelId til oppfølgningsspørsmålet i svaret til det gjeldende spørsmålet
 *
 * regelId = SLUTT_NODE brukes for å definere at svaret  *ikke* krever oppfølgingssørsmål
 */
export type RegelId = SluttNode | ReglerPassBarn | ReglerBoutgifter | string;

export type ReglerPassBarn =
    | 'ANNEN_FORELDER_MOTTAR_STØTTE'
    | 'UTGIFTER_DOKUMENTERT'
    | 'HAR_FULLFØRT_FJERDEKLASSE'
    | 'UNNTAK_ALDER';

export type ReglerBoutgifter =
    | 'NØDVENDIGE_MERUTGIFTER'
    | 'HØYERE_BOUTGIFTER_SAMMENLIGNET_MED_TIDLIGERE'
    | 'NØDVENDIG_Å_BO_NÆRMERE_AKTIVITET'
    | 'RETT_TIL_BOSTØTTE'
    | 'HØYERE_UTGIFTER_HELSEMESSIG_ÅRSAKER'
    | 'DOKUMENTERT_UTGIFTER_BOLIG';

export type SluttNode = 'SLUTT_NODE';

export type SvarId = string;

export type Begrunnelse = string | undefined;

export enum BegrunnelseRegel {
    'PÅKREVD' = 'PÅKREVD',
    'VALGFRI' = 'VALGFRI',
    'UTEN' = 'UTEN',
}

export interface Svaralternativ {
    regelId: RegelId;
    begrunnelseType: BegrunnelseRegel;
}

type SvarMapping = Record<SvarId, Svaralternativ>;

export interface Regel {
    regelId: string;
    erHovedregel: boolean;
    svarMapping: SvarMapping;
}

export type Regler = {
    [key in RegelId]: Regel;
};

export type Vilkårsregler<T extends Vilkårtype> = {
    vilkårType: T;
    regler: Regler;
};

export interface ReglerResponse {
    vilkårsregler: ReglerForVilkår;
}

export type ReglerForVilkår = {
    [key in Vilkårtype]: Vilkårsregler<key>;
};
