import { harTallverdi } from './tall';

export const TANKESTREKK = `–`;

export const tallMedTusenSkille = (verdi?: number): string | undefined => {
    if (!harTallverdi(verdi)) return undefined;
    const erDesimaltall = !Number.isInteger(verdi);
    return Number(verdi).toLocaleString('no-NO', {
        currency: 'NOK',
        ...(erDesimaltall && { minimumFractionDigits: 2 }),
    });
};

export const formaterTallMedTusenSkille = (verdi?: number): string =>
    tallMedTusenSkille(verdi) || '';

export const formaterTallMedTusenSkilleEllerStrek = (verdi?: number): string =>
    tallMedTusenSkille(verdi) || '-';

export const tilLitenSkriftMedStorForbokstav = (mottakerRolle: string): string => {
    const rolleLowerCase = mottakerRolle.toLowerCase();
    const firstLetterUpperCase = mottakerRolle.charAt(0).toUpperCase();
    return firstLetterUpperCase + rolleLowerCase.slice(1);
};

export const leggTilKolonOgMellomrom = (str?: string) => {
    return str ? `${str}: ` : '';
};
