import {
    addDays,
    format,
    formatISO,
    isAfter,
    isBefore,
    isEqual,
    isValid,
    parseISO,
} from 'date-fns';

export const formaterNullableIsoDato = (dato?: string): string | undefined =>
    dato && formaterIsoDato(dato);

export const formaterIsoDato = (dato: string): string => {
    return format(parseISO(dato), 'dd.MM.yyyy');
};

export const formaterIsoDatoTid = (dato: string): string => {
    return format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm");
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

export const tilLocaleDateString = (dato: Date) => formatISO(dato, { representation: 'date' });

export const tilÅrMåned = (date: Date): string => {
    return formatISO(date).substring(0, 7);
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
