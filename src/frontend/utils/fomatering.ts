import { harTallverdi } from './tall';

export const formaterTallMedTusenSkille = (verdi?: number): string =>
    harTallverdi(verdi) ? Number(verdi).toLocaleString('no-NO', { currency: 'NOK' }) : '';

export const formaterTallMedTusenSkilleEllerStrek = (verdi?: number): string =>
    harTallverdi(verdi) && verdi !== 0
        ? Number(verdi).toLocaleString('no-NO', { currency: 'NOK' })
        : '-';
