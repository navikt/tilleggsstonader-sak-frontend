import { Målgruppe, MålgruppeType } from './typer/målgruppe';
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

export interface Aktivitet extends VilkårPeriode {
    id: string;
    type: AktivitetType;
    detaljer: DelvilkårAktivitet;
}

export enum AktivitetType {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
    REEL_ARBEIDSSØKER = 'REEL_ARBEIDSSØKER',
}

interface DelvilkårAktivitet {
    lønnet: Vurdering;
    mottarSykepenger: Vurdering;
}

export interface Stønadsperiode extends Periode {
    id?: string;
    målgruppe: MålgruppeType | '';
    aktivitet: AktivitetType | '';
}
