const replaceUnderscoreWithSpace = (str: string): string => {
    return str.replaceAll('_', ' ');
};

const toTitleCase = (str: string): string =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

export const formaterEnumVerdi = (str: string): string =>
    replaceUnderscoreWithSpace(toTitleCase(str));

export const utledNavnFnrOgAlder = (navn: string, ident: string, alder?: string) => {
    const formatertAlder = alder ? ` (${alder} år)` : '';
    return `${navn} ${ident}${formatertAlder}`;
};

export const tekstEllerVerdi = <T extends string>(
    mapping: Record<T, string>,
    verdi?: T
): string | undefined => (verdi && mapping[verdi]) || verdi;
