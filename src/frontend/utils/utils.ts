export const harIkkeVerdi = (str: string | undefined | null): boolean => !harVerdi(str);

export const harVerdi = (str: string | undefined | null): boolean => !!str && str.trim() !== '';
