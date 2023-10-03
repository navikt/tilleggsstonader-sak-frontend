import { erDesimaltall } from '../../../../utils/tall';

export const validerGyldigTallverdi = (verdi: string | number | undefined | null) => {
    const ugyldigVerdiFeilmelding = `Ugyldig verdi - kun heltall tillatt`;
    if (typeof verdi === 'number') {
        return isNaN(verdi) || erDesimaltall(verdi) ? ugyldigVerdiFeilmelding : undefined;
    }
    if (typeof verdi === 'string') {
        return !/^[0-9]+$/.test(verdi) ? ugyldigVerdiFeilmelding : undefined;
    }
};
