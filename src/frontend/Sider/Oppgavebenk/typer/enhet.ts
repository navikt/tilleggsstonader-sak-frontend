export enum IkkeFortroligEnhet {
    NAY = '4462',
    EGNE_ANSATTE = '4483',
}

export enum FortroligEnhet {
    VIKAFOSSEN = '2103',
}

const enhetTilTekstIkkeFortrolig: Record<IkkeFortroligEnhet.NAY, string> = {
    '4462': '4462 Tilleggsstønad INN', // Nasjonal kø for NAY
};

const enhetTilTekstEgenAnsatte: Record<IkkeFortroligEnhet.EGNE_ANSATTE, string> = {
    '4483': '4483 Egne ansatte',
};

const enhetTilTekstFortrolig: Record<FortroligEnhet, string> = {
    '2103': '2103 NAV Vikafossen',
};

export const enhetTilTekstPåString: Record<string, string> = {
    ...enhetTilTekstIkkeFortrolig,
    ...enhetTilTekstFortrolig,
    ...enhetTilTekstEgenAnsatte,
};

export const enhetTilTekst = (
    harSaksbehandlerStrengtFortroligRolle: boolean,
    harSaksbehandlerEgenAnsattRolle: boolean
): Record<string, string> => {
    if (harSaksbehandlerStrengtFortroligRolle) {
        return enhetTilTekstFortrolig;
    } else if (harSaksbehandlerEgenAnsattRolle) {
        return { ...enhetTilTekstIkkeFortrolig, ...enhetTilTekstEgenAnsatte };
    } else {
        return enhetTilTekstIkkeFortrolig;
    }
};
