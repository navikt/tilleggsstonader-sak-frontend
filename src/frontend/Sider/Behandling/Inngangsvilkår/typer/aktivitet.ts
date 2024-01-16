import { SvarJaNei, VilkårPeriode } from './vilkårperiode';

export interface Aktivitet extends VilkårPeriode {
    id: string;
    type: AktivitetType;
    delvilkår: DelvilkårAktivitet;
}

export enum AktivitetType {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
    REEL_ARBEIDSSØKER = 'REEL_ARBEIDSSØKER',
}

interface DelvilkårAktivitet {
    lønnet: SvarJaNei;
    mottarSykepenger: SvarJaNei;
}
