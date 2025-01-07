export enum IkkeFortroligEnhet {
    NAY = '4462',
    NAY_ROMERIKE = '4402', // Håndterer utlandssaker
    EGNE_ANSATTE = '4483',
}

export enum FortroligEnhet {
    VIKAFOSSEN = '2103',
}

const enhetTilTekstIkkeFortrolig: Record<IkkeFortroligEnhet.NAY, string> = {
    '4462': '4462 Tilleggsstønad INN', // Nasjonal kø for NAY
};

const enhetTilTekstNayUtland: Record<IkkeFortroligEnhet.NAY_ROMERIKE, string> = {
    '4402': '4402 NAY Romerike', // Kø før NAY Utland
};

const enhetTilTekstEgenAnsatte: Record<IkkeFortroligEnhet.EGNE_ANSATTE, string> = {
    '4483': '4483 Egne ansatte',
};

const enhetTilTekstFortrolig: Record<FortroligEnhet, string> = {
    '2103': '2103 Nav Vikafossen',
};

type Enheter = IkkeFortroligEnhet | FortroligEnhet;

export const enhetTilTekst = (
    harSaksbehandlerStrengtFortroligRolle: boolean,
    harSaksbehandlerEgenAnsattRolle: boolean,
    harSaksbehandlerNayUtlandRolle: boolean
): Partial<Record<Enheter, string>> => {
    // Fortrolig rolle skal kun se enhet for fortrolig rolle
    if (harSaksbehandlerStrengtFortroligRolle) {
        return enhetTilTekstFortrolig;
    }

    let enheter: Partial<Record<Enheter, string>> = enhetTilTekstIkkeFortrolig;
    if (harSaksbehandlerEgenAnsattRolle) {
        enheter = { ...enheter, ...enhetTilTekstEgenAnsatte };
    }
    if (harSaksbehandlerNayUtlandRolle) {
        enheter = { ...enheter, ...enhetTilTekstNayUtland };
    }

    return enheter;
};
