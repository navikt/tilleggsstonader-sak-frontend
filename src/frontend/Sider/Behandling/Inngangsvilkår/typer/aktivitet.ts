import { VilkårPeriode, Vurdering } from './vilkårperiode';

export interface Aktivitet extends VilkårPeriode {
    id: string;
    type: AktivitetType;
    delvilkår: DelvilkårAktivitet;
}

interface DelvilkårAktivitet {
    lønnet?: Vurdering;
    mottarSykepenger: Vurdering;
}

export enum AktivitetType {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
    REEL_ARBEIDSSØKER = 'REEL_ARBEIDSSØKER',
}
