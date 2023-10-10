import { Vilkårtype } from '../Sider/Behandling/vilkår';

type SluttNode = 'SLUTT_NODE';

type RegelId = SluttNode | string;

type SvarId = string;

enum BegrunnelseRegel {
    'PÅKREVD' = 'PÅKREVD',
    'VALGFRI' = 'VALGFRI',
    'UTEN' = 'UTEN',
}

interface Svarsalternativ {
    regelId: RegelId;
    begrunnelseType: BegrunnelseRegel;
}

type SvarMapping = Record<SvarId, Svarsalternativ>;

export interface Regel {
    regelId: string;
    svarMapping: SvarMapping;
}

type Regler = {
    [key in RegelId]: Regel;
};

export type Vilkårsregler<T extends Vilkårtype> = {
    vilkårType: T;
    regler: Regler;
};

export interface ReglerResponse {
    vilkårsregler: {
        [key in Vilkårtype]: Vilkårsregler<key>;
    };
}
