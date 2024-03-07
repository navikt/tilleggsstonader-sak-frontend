import { Vilkårtype } from '../Sider/Behandling/vilkår';

/*
Regeltreet er bygd opp av regler og tilhørende svaralternativer. Disse kan igjen kan ha nye regler knytta til seg.
I tilfellene der et svar *ikke* krever oppfølgingssørsmål, vil regelID=SLUTT_NODE i svaralternativet.
*/
export type RegelId = SluttNode | string;

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
