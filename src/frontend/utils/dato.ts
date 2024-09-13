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

export const formaterNullableIsoDato = (dato?: string): string | undefined =>
    dato && formaterIsoDato(dato);

export const formaterIsoDato = (dato: string): string => {
    return format(parseISO(dato), 'dd.MM.yyyy');
};

export const formaterIsoDatoTid = (dato: string): string => {
    return format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm");
};

export const formaterIsoDatoTidKort = (dato: string): string => {
    return format(parseISO(dato), 'dd.MM.yyyy HH:mm');
};

export const formaterIsoDatoTidMedSekunder = (dato: string): string => {
    return format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm:ss");
};
export const formaterIsoPeriode = (fom: string, tom: string): string => {
    return formaterIsoDato(fom) + ' - ' + formaterIsoDato(tom);
};

export const formaterNullableIsoDatoTid = (dato?: string): string | undefined => {
    return dato && formaterIsoDatoTid(dato);
};

export const formaterIsoKlokke = (dato: string): string => {
    return format(parseISO(dato), "'kl'.HH:mm");
};

export const nullableTilDato = (dato: string | Date | undefined): Date | undefined => {
    if (typeof dato === 'string') {
        return dato !== '' ? parseISO(dato) : undefined;
    } else {
        return dato;
    }
};

export const formaterDato = (dato?: string | Date): string | undefined => {
    return dato && format(tilDato(dato), 'dd.MM.yyyy');
};

export const dagensDatoFormatert = (): string => {
    return new Date().toLocaleDateString('no-NO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const tilDato = (dato: string | Date): Date =>
    typeof dato === 'string' ? parseISO(dato) : dato;

export const erDatoEtterEllerLik = (fra: string, til: string): boolean => {
    const datoFra = tilDato(fra);
    const datoTil = tilDato(til);

    return isEqual(datoFra, datoTil) || isAfter(datoTil, datoFra);
};

export const erDatoFørEllerLik = (fra: string, til: string): boolean => {
    const datoFra = tilDato(fra);
    const datoTil = tilDato(til);

    return isEqual(datoFra, datoTil) || isBefore(datoFra, datoTil);
};

export const erEtter = (first: string | Date, second: string | Date): boolean => {
    return isAfter(tilDato(first), tilDato(second));
};

export const erEtterDagensDato = (dato: string | Date): boolean => {
    return erEtter(dato, new Date());
};

export const tilLocaleDateString = (dato: Date) => formatISO(dato, { representation: 'date' });

export const tilÅrMåned = (date: Date): string => {
    return formatISO(date).substring(0, 7);
};

export const formaterNullableTilTekstligDato = (
    dato: Date | string | undefined
): string | undefined => dato && formaterTilTekstligDato(dato);

export const formaterTilTekstligDato = (dato: Date | string): string => {
    return format(tilDato(dato), 'd. MMMM yyyy', { locale: nb });
};

const erGyldigFormat = (verdi: string): boolean => {
    const YYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

    if (verdi && String(verdi).match(YYYYMMDD)) {
        return true;
    } else {
        return false;
    }
};

export const erGyldigDato = (dato: string | Date): boolean =>
    typeof dato === 'string' ? erGyldigFormat(dato) && isValid(tilDato(dato)) : isValid(dato);

export const plusDager = (dato: string | Date, antallDager: number): string =>
    tilLocaleDateString(addDays(tilDato(dato), antallDager));

export const formaterNullableÅrMåned = (dato: string | undefined): string | undefined =>
    dato && formaterÅrMåned(dato);

export const formaterÅrMåned = (dato: string): string =>
    format(parseISO(dato), 'MMM yyyy', { locale: nb });

export const dagensDato = (): string => tilLocaleDateString(new Date());

// Funksjon finner første dag i måneden tre måneder før gitt dato eller dagens dato
export const førsteDagIMånedTreMånederForut = (dato?: string): string => {
    const utgangspunktDato = dato ? tilDato(dato) : new Date();
    return tilLocaleDateString(startOfMonth(addMonths(tilDato(utgangspunktDato), -3)));
};

export const formaterIsoÅr = (dato: string): number => {
    return parseISO(dato).getFullYear();
};

export const dagerSiden = (dato: string | Date, dato2: string | Date): number =>
    differenceInDays(tilDato(dato), tilDato(dato2));

export const tilFørsteDagenIMåneden = (dato: string | Date): string =>
    tilLocaleDateString(startOfMonth(tilDato(dato)));

export const tilSisteDagenIMåneden = (dato: string | Date): string =>
    tilLocaleDateString(endOfMonth(tilDato(dato)));
