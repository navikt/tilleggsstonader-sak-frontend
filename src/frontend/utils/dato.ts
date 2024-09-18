import {
    differenceInDays,
    addDays,
    addMonths,
    format,
    formatISO,
    endOfMonth,
    isAfter,
    isBefore,
    isEqual,
    isValid,
    parseISO,
    startOfMonth,
} from 'date-fns';
import { nb } from 'date-fns/locale';

// Eksempel: formaterNullableIsoDato('2023-09-18') -> '18.09.2023'
export const formaterNullableIsoDato = (dato?: string): string | undefined =>
    dato && formaterIsoDato(dato);

// Eksempel: formaterIsoDato('2023-09-18') -> '18.09.2023'
export const formaterIsoDato = (dato: string): string => {
    return format(parseISO(dato), 'dd.MM.yyyy');
};

// Eksempel: formaterIsoDatoTid('2023-09-18T10:30:00') -> '18.09.2023 kl.10:30'
export const formaterIsoDatoTid = (dato: string): string => {
    return format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm");
};

// Eksempel: formaterIsoDatoTidKort('2023-09-18T10:30:00') -> '18.09.2023 10:30'
export const formaterIsoDatoTidKort = (dato: string): string => {
    return format(parseISO(dato), 'dd.MM.yyyy HH:mm');
};

// Eksempel: formaterIsoPeriode('2023-09-18', '2023-10-18') -> '18.09.2023 - 18.10.2023'
export const formaterIsoPeriode = (fom: string, tom: string): string => {
    return formaterIsoDato(fom) + ' - ' + formaterIsoDato(tom);
};

// Eksempel: formaterNullableIsoDatoTid('2023-09-18T10:30:00') -> '18.09.2023 kl.10:30'
export const formaterNullableIsoDatoTid = (dato?: string): string | undefined => {
    return dato && formaterIsoDatoTid(dato);
};

// Eksempel: formaterIsoKlokke('2023-09-18T10:30:00') -> 'kl.10:30'
export const formaterIsoKlokke = (dato: string): string => {
    return format(parseISO(dato), "'kl'. HH:mm");
};

// Eksempel: nullableTilDato('2023-09-18') -> Date('2023-09-18')
export const nullableTilDato = (dato: string | Date | undefined): Date | undefined => {
    if (typeof dato === 'string') {
        return dato !== '' ? parseISO(dato) : undefined;
    } else {
        return dato;
    }
};

// Eksempel: formaterDato('2023-09-18') -> '18.09.2023'
export const formaterDato = (dato?: string | Date): string | undefined => {
    return dato && format(tilDato(dato), 'dd.MM.yyyy');
};

// Eksempel: dagensDatoFormatert() -> '18.09.2023'
export const dagensDatoFormatert = (): string => {
    return new Date().toLocaleDateString('no-NO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

// Eksempel: tilDato('2023-09-18') -> Date('2023-09-18')
export const tilDato = (dato: string | Date): Date =>
    typeof dato === 'string' ? parseISO(dato) : dato;

// Eksempel: erDatoEtterEllerLik('2023-09-18', '2023-09-17') -> true
export const erDatoEtterEllerLik = (fra: string, til: string): boolean => {
    const datoFra = tilDato(fra);
    const datoTil = tilDato(til);

    return isEqual(datoFra, datoTil) || isAfter(datoTil, datoFra);
};

// Eksempel: erDatoFørEllerLik('2023-09-18', '2023-09-19') -> true
export const erDatoFørEllerLik = (fra: string, til: string): boolean => {
    const datoFra = tilDato(fra);
    const datoTil = tilDato(til);

    return isEqual(datoFra, datoTil) || isBefore(datoFra, datoTil);
};

// Eksempel: erEtter('2023-09-18', '2023-09-17') -> true
export const erEtter = (first: string | Date, second: string | Date): boolean => {
    return isAfter(tilDato(first), tilDato(second));
};

// Eksempel: erEtterDagensDato('2023-09-19') -> true
export const erEtterDagensDato = (dato: string | Date): boolean => {
    return erEtter(dato, new Date());
};

// Eksempel: tilLocaleDateString(new Date()) -> '2023-09-18'
export const tilLocaleDateString = (dato: Date) => formatISO(dato, { representation: 'date' });

// Eksempel: tilÅrMåned(new Date('2023-09-18')) -> '2023-09'
export const tilÅrMåned = (date: Date): string => {
    return formatISO(date).substring(0, 7);
};

// Eksempel: formaterNullableTilTekstligDato('2023-09-18') -> '18. september 2023'
export const formaterNullableTilTekstligDato = (
    dato: Date | string | undefined
): string | undefined => dato && formaterTilTekstligDato(dato);

// Eksempel: formaterTilTekstligDato('2023-09-18') -> '18. september 2023'
export const formaterTilTekstligDato = (dato: Date | string): string => {
    return format(tilDato(dato), 'd. MMMM yyyy', { locale: nb });
};

// Eksempel: erGyldigFormat('2023-09-18') -> true
const erGyldigFormat = (verdi: string): boolean => {
    const YYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

    if (verdi && String(verdi).match(YYYYMMDD)) {
        return true;
    } else {
        return false;
    }
};

// Eksempel: erGyldigDato('2023-09-18') -> true
export const erGyldigDato = (dato: string | Date): boolean =>
    typeof dato === 'string' ? erGyldigFormat(dato) && isValid(tilDato(dato)) : isValid(dato);

// Eksempel: plusDager('2023-09-18', 5) -> '2023-09-23'
export const plusDager = (dato: string | Date, antallDager: number): string =>
    tilLocaleDateString(addDays(tilDato(dato), antallDager));

// Eksempel: formaterNullableÅrMåned('2023-09-18') -> 'sep 2023'
export const formaterNullableÅrMåned = (dato: string | undefined): string | undefined =>
    dato && formaterÅrMåned(dato);

// Eksempel: formaterÅrMåned('2023-09-18') -> 'sep 2023'
export const formaterÅrMåned = (dato: string): string =>
    format(parseISO(dato), 'MMM yyyy', { locale: nb });

// Eksempel: dagensDato() -> '2023-09-18'
export const dagensDato = (): string => tilLocaleDateString(new Date());

/*
 * Funksjon finner første dag i måneden tre måneder før gitt dato eller dagens dato
 * Eksempel: førsteDagIMånedTreMånederForut('2023-09-18') -> '2023-06-01'
 */
export const førsteDagIMånedTreMånederForut = (dato?: string): string => {
    const utgangspunktDato = dato ? tilDato(dato) : new Date();
    return tilLocaleDateString(startOfMonth(addMonths(tilDato(utgangspunktDato), -3)));
};

// Eksempel: formaterIsoÅr('2023-09-18') -> 2023
export const formaterIsoÅr = (dato: string): number => {
    return parseISO(dato).getFullYear();
};

// Eksempel: dagerSiden('2023-09-18', '2023-09-15') -> 3
export const dagerSiden = (dato: string | Date, dato2: string | Date): number =>
    differenceInDays(tilDato(dato), tilDato(dato2));

// Eksempel: tilFørsteDagenIMåneden('2023-09-18') -> '2023-09-01'
export const tilFørsteDagenIMåneden = (dato: string | Date): string =>
    tilLocaleDateString(startOfMonth(tilDato(dato)));

// Eksempel: tilSisteDagenIMåneden('2023-09-18') -> '2023-09-30'
export const tilSisteDagenIMåneden = (dato: string | Date): string =>
    tilLocaleDateString(endOfMonth(tilDato(dato)));
