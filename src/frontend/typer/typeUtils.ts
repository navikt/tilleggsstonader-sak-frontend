export function valuerOrThrow<T>(
    verdi: T | undefined | null,
    message: string = 'Mangler verdi'
): T {
    if (verdi === undefined || verdi === null) {
        throw new TypeError(message);
    }

    return verdi;
}
