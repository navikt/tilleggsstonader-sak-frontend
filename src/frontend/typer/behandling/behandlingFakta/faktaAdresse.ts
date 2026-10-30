export interface FaktaAdresse {
    gateadresse?: string;
    postnummer?: string;
    poststed?: string;
    landkode?: string;
}

export function adresselinjer(adresse?: FaktaAdresse): string[] {
    if (!adresse) {
        return [];
    }

    return [
        adresse.gateadresse,
        [adresse.postnummer, adresse.poststed].filter(Boolean).join(' '),
        adresse.landkode,
    ].filter((linje): linje is string => Boolean(linje));
}
