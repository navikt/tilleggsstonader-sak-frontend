import { erProd } from '../../../utils/miljø';

export enum IkkeFortroligEnhet {
    NAY = '4462',
    NAY_ROMERIKE = '4402', // Håndterer utlandssaker
    EGNE_ANSATTE = '4483',
    TILTAK_OSLO = '0387',
}

export enum FortroligEnhet {
    VIKAFOSSEN = '2103',
}

const enhetTilTekstIkkeFortrolig: Partial<Record<IkkeFortroligEnhet, string>> = {
    '4462': '4462 Tilleggsstønad INN', // Nasjonal kø for NAY
};

//Legger til en egen variabel for dev da vi ikke har TS-sak mapper for Nav tiltak Oslo i prod
const enhetTilTekstIkkeFortroligDev: Partial<Record<IkkeFortroligEnhet, string>> = {
    '4462': '4462 Tilleggsstønad INN', // Nasjonal kø for NAY
    '0387': '0387 Nav tiltak Oslo',
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

    let enheter: Partial<Record<Enheter, string>> = erProd()
        ? enhetTilTekstIkkeFortrolig
        : enhetTilTekstIkkeFortroligDev;
    if (harSaksbehandlerEgenAnsattRolle) {
        enheter = { ...enheter, ...enhetTilTekstEgenAnsatte };
    }
    if (harSaksbehandlerNayUtlandRolle) {
        enheter = { ...enheter, ...enhetTilTekstNayUtland };
    }

    return enheter;
};
