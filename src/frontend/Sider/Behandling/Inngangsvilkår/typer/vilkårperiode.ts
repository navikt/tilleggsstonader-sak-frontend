import { Aktivitet } from './aktivitet';
import { Målgruppe } from './målgruppe';
import { Periode } from '../../../../utils/periode';
import { Vilkårsresultat } from '../../vilkår';

export interface Vilkårperioder {
    målgrupper: Målgruppe[];
    aktiviteter: Aktivitet[];
}

export interface VilkårPeriode extends Periode {
    id: string;
    resultat: Vilkårsresultat;
    begrunnelse?: string;
    kilde: KildeVilkårsperiode;
    slettetKommentar?: string;
}

export enum KildeVilkårsperiode {
    MANUELL = 'MANUELL',
    SYSTEM = 'SYSTEM',
}

export enum SvarJaNei {
    JA = 'JA',
    JA_IMPLISITT = 'JA_IMPLISITT',
    NEI = 'NEI',
}
