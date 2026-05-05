import { tallMedTusenSkille } from './fomatering';
import { harTallverdi } from './tall';

const replaceUnderscoreWithSpace = (str: string): string => {
    return str.replaceAll('_', ' ');
};

export const toTitleCase = (str: string): string =>
    str.replace(
        /\p{L}+/gu,
        (word) => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
    );

export const formaterEnumVerdi = (str: string | undefined): string =>
    str ? replaceUnderscoreWithSpace(toTitleCase(str)) : '';

export const formatBoolean = (bool?: boolean): string => {
    if (bool === true) {
        return 'Ja';
    } else if (bool === false) {
        return 'Nei';
    } else {
        return '';
    }
};

export const utledNavnFnrOgAlder = (navn: string, ident: string, alder?: number) => {
    const formatertAlder = harTallverdi(alder) ? ` (${alder} år)` : '';
    return `${navn} ${ident}${formatertAlder}`;
};

export const utledNavnOgAlder = (navn: string, alder?: number) => {
    const formatertAlder = harTallverdi(alder) ? ` (${alder} år)` : '';
    return `${navn} ${formatertAlder}`;
};

/**
 * I tilfeller der det mangler tekstmapping skal vi fallbacke til selve koden, så hindrer vi at viktig info blir skjult.
 */
export const tekstMedFallback = <T extends string>(
    mapping: Record<T, string>,
    kode?: T
): string | undefined => (kode && mapping[kode]) || kode;

export const kronerEllerStrek = (tall: number | undefined): string =>
    harTallverdi(tall) ? `${tall} kr` : '-';

export const kronerMedTusenSkilleEllerStrek = (tall: number | undefined): string =>
    tallMedTusenSkille(tall) ? `${tallMedTusenSkille(tall)} kr` : '-';
