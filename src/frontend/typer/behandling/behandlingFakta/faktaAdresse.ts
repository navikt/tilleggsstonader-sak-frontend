export interface FaktaAdresse {
    gateadresse?: string | null;
    postnummer?: string | null;
    poststed?: string | null;
    landkode?: string | null;
}

export function adresseTilTekst(adresse: FaktaAdresse): string {
    return `${adresse.gateadresse ?? ''} ${adresse.postnummer ?? ''} ${adresse.poststed ?? ''}`.trim();
}
