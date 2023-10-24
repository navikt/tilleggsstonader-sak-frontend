export const harIkkeVerdi = (str: string | undefined | null): boolean => !harVerdi(str);

export const harVerdi = (str: string | undefined | null): boolean =>
    str !== undefined && str !== '' && str !== null;

export const harTallverdi = (verdi: number | undefined | null | string): boolean =>
    verdi !== undefined && verdi !== null;
