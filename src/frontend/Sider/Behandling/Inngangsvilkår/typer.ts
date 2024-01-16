import { Aktivitet } from './typer/aktivitet';
import { Målgruppe } from './typer/målgruppe';
import { Periode } from '../../../utils/periode';
import { Vilkårsresultat } from '../vilkår';

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

enum KildeVilkårsperiode {
    MANUELL = 'MANUELL',
    SYSTEM = 'SYSTEM',
}

export enum SvarJaNei {
    JA = 'JA',
    JA_IMPLISITT = 'JA_IMPLISITT',
    NEI = 'NEI',
}

export interface Vurdering {
    svar: SvarJaNei;
    resultat: Vilkårsresultat;
}
