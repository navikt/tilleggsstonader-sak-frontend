import { RessursFeilet, RessursStatus, RessursStatusFeilet } from '../../typer/ressurs';

export interface Feil {
    feilmelding: string;
    tittel?: string;
    status?: RessursStatusFeilet;
    feilkode?: string;
    feilmeldingMedFeilkode?: string;
}

export const feiletRessursTilFeilmelding = (
    feiletRessurs: RessursFeilet,
    tittel?: string
): Feil => ({
    feilmelding: feiletRessurs.frontendFeilmeldingUtenFeilkode || feiletRessurs.frontendFeilmelding,
    tittel: tittel,
    status: feiletRessurs.status,
    feilkode: feiletRessurs.feilkode,
    feilmeldingMedFeilkode: feiletRessurs.frontendFeilmelding,
});

export const lagFeilmelding = (
    feilmelding: string,
    tittel?: string,
    ressursStatus?: RessursStatusFeilet
) => ({
    feilmelding: feilmelding,
    tittel: tittel,
    status: ressursStatus,
});

export const finnFeilmeldingVariant = (status: RessursStatus | undefined): 'error' | 'warning' => {
    switch (status) {
        case RessursStatus.FEILET:
        case RessursStatus.IKKE_TILGANG:
            return 'error';

        case RessursStatus.FUNKSJONELL_FEIL:
        default:
            return 'warning';
    }
};

export const erFeil = (feil: unknown): feil is Feil => {
    if (typeof feil === 'object' && feil && 'feilmelding' in feil) {
        return true;
    }
    return false;
};
