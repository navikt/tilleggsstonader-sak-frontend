import { VilkårPeriode, Vurdering } from './vilkårperiode';
import { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';

export interface Aktivitet extends VilkårPeriode {
    id: string;
    type: AktivitetType;
    aktivitetsdager: number;
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

export const AktivitetTypeTilTekst: Record<AktivitetType, string> = {
    TILTAK: 'Tiltak',
    UTDANNING: 'Utdanning',
    REEL_ARBEIDSSØKER: 'Reell arbeidssøker',
};

export const AktivitetTypeOptions: SelectOption[] = Object.entries(AktivitetTypeTilTekst).map(
    ([value, label]) => ({
        value: value,
        label: label,
    })
);
