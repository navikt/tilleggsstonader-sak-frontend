import { VilkårPeriode, Vurdering } from './vilkårperiode';

export interface Aktivitet extends VilkårPeriode {
    id: string;
    type: AktivitetType;
    delvilkår: DelvilkårAktivitet;
}

export interface DelvilkårAktivitet {
    '@type': 'AKTIVITET';
    lønnet?: Vurdering;
    mottarSykepenger?: Vurdering;
}

export enum AktivitetType {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
    REEL_ARBEIDSSØKER = 'REEL_ARBEIDSSØKER',
}
