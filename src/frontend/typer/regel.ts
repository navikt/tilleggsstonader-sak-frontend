import { Vilkårtype } from '../Sider/Behandling/vilkår';

/*
 * Regeltreet er bygd opp av regler og tilhørende svaralternativer. Svaralternativet kan igjen kan ha nye regler knytta til seg.
 *
 * Strukturen til treet defineres ved å angi regelId til oppfølgningsspørsmålet i svaret til det gjeldende spørsmålet
 *
 * regelId = SLUTT_NODE brukes for å definere at svaret  *ikke* krever oppfølgingssørsmål
 */
export type RegelId = SluttNode | string;

export type SluttNode = 'SLUTT_NODE';

export type SvarId = string;

export type Begrunnelsestype = 'PÅKREVD' | 'VALGFRI' | 'UTEN';

export interface Svaralternativ {
    regelId: RegelId;
    begrunnelseType: Begrunnelsestype;
}

type SvarMapping = Record<SvarId, Svaralternativ>;

export interface Regel {
    regelId: string;
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
