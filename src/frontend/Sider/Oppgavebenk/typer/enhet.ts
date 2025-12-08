import { AppEnv } from '../../../utils/env';
import {
    harEgenAnsattRolle,
    harNayTilleggsstønaderRolle,
    harNayUtlandRolle,
    harStrengtFortroligRolle,
    harTiltaksenhetenTilleggsstønaderRolle,
} from '../../../utils/roller';
import { Saksbehandler } from '../../../utils/saksbehandler';

export enum IkkeFortroligEnhet {
    NAY = '4462',
    NAY_ROMERIKE = '4402', // Håndterer utlandssaker
    EGNE_ANSATTE = '4483',
    TILTAK_OSLO = '0387',
}

export enum FortroligEnhet {
    VIKAFOSSEN = '2103',
}

export const enhetTilTekst: Record<Enheter, string> = {
    '4462': '4462 Tilleggsstønad INN',
    '4402': '4402 NAY Romerike',
    '4483': '4483 Egne ansatte',
    '0387': '0387 Nav tiltak Oslo',
    '2103': '2103 Nav Vikafossen',
};

export type Enheter = IkkeFortroligEnhet | FortroligEnhet;

export const hentEnheterSaksbehandlerHarTilgangTil = (
    appEnv: AppEnv,
    saksbehandler: Saksbehandler
): Enheter[] => {
    const harSaksbehandlerStrengtFortroligRolle = harStrengtFortroligRolle(appEnv, saksbehandler);

    // Fortrolig rolle skal kun se enhet for fortrolig rolle
    if (harSaksbehandlerStrengtFortroligRolle) {
        return [FortroligEnhet.VIKAFOSSEN];
    }

    const enheter: Enheter[] = [];

    if (harNayTilleggsstønaderRolle(appEnv, saksbehandler)) {
        enheter.push(IkkeFortroligEnhet.NAY);
    }
    if (harTiltaksenhetenTilleggsstønaderRolle(appEnv, saksbehandler)) {
        enheter.push(IkkeFortroligEnhet.TILTAK_OSLO);
    }
    if (harEgenAnsattRolle(appEnv, saksbehandler)) {
        enheter.push(IkkeFortroligEnhet.EGNE_ANSATTE);
    }
    if (harNayUtlandRolle(appEnv, saksbehandler)) {
        enheter.push(IkkeFortroligEnhet.NAY_ROMERIKE);
    }

    // Vis oppgaver for NAY som default dersom saksbehandler ikke har noen eksplisitte tilganger?
    return enheter.length == 0 ? [IkkeFortroligEnhet.NAY] : enheter;
};
