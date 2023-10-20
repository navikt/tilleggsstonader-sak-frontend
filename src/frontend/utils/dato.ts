import { format, parseISO, isAfter, formatISO } from 'date-fns';

export const formaterIsoDatoTid = (dato: string): string => {
    return format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm");
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

export const dagensDatoFormatert = (): string => {
    return new Date().toLocaleDateString('no-NO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};
const tilDato = (dato: string | Date): Date => (typeof dato === 'string' ? parseISO(dato) : dato);

export const erDatoEtterEllerLik = (fra: string, til: string): boolean => {
    const datoFra = tilDato(fra);
    const datoTil = tilDato(til);

    return isAfter(datoFra, datoTil);
};

export const tilLocaleDateString = (dato: Date) => formatISO(dato, { representation: 'date' });

export const tilÅrMåned = (date: Date): string => {
    return formatISO(date).substring(0, 7);
};
