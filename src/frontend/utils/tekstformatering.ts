const replaceUnderscoreWithSpace = (str: string): string => {
    return str.replaceAll('_', ' ');
};

export const toTitleCase = (str: string): string =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

export const formaterEnumVerdi = (str: string): string =>
    replaceUnderscoreWithSpace(toTitleCase(str));

export const formatBoolean = (bool?: boolean): string => {
    if (bool === true) {
        return 'Ja';
    } else if (bool === false) {
        return 'Nei';
    } else {
        return '';
    }
};

export const utledNavnFnrOgAlder = (navn: string, ident: string, alder?: string) => {
    const formatertAlder = alder ? ` (${alder} år)` : '';
    return `${navn} ${ident}${formatertAlder}`;
};

/**
 * I tilfeller tekstmapping mapping skal man vise kode sånn at man ikke viser tom streng og saksbehandler
 * går miste om at det finnes et verdi
 */
export const tekstEllerKode = <T extends string>(
    mapping: Record<T, string>,
    kode?: T
): string | undefined => (kode && mapping[kode]) || kode;
