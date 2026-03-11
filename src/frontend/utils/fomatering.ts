import { harTallverdi } from './tall';

export const TANKESTREKK = `–`;

export const formaterTallMedTusenSkille = (verdi?: number): string =>
    harTallverdi(verdi) ? Number(verdi).toLocaleString('no-NO', { currency: 'NOK' }) : '';

export const formaterTallMedTusenSkilleEllerStrek = (verdi?: number): string =>
    harTallverdi(verdi) ? Number(verdi).toLocaleString('no-NO', { currency: 'NOK' }) : '-';

export const tilLitenSkriftMedStorForbokstav = (mottakerRolle: string): string => {
    const rolleLowerCase = mottakerRolle.toLowerCase();
    const firstLetterUpperCase = mottakerRolle.charAt(0).toUpperCase();
    return firstLetterUpperCase + rolleLowerCase.slice(1);
};

export const leggTilKolonOgMellomrom = (str?: string) => {
    return str ? `${str}: ` : '';
};
export function formaterAntallOgPris(antall: number | undefined, pris: number | undefined): string {
    if (!antall) {
        return '-';
    }
    return `${antall} x ${pris} kr`;
}
