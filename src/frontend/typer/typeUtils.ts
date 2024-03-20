export function valuerOrThrow<T>(
    verdi: T | undefined | null,
    message: string = 'Mangler verdi'
): T {
    if (verdi === undefined || verdi === null) {
        throw new TypeError(message);
    }

    return verdi;
}

export function erTomtObjekt(obj: object) {
    return Object.keys(obj).length === 0;
}

export const manglerInnhold = (str: string | undefined | null): boolean => {
    return !str || str.trim() === '';
};
