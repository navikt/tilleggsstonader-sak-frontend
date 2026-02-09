import { søkerHarStrengtFortroligAdresse } from './adressebeskyttelse';
import { AppEnv } from './env';
import {
    harEgenAnsattOsloRolle,
    harNayEgenAnsattRolle,
    harNayTilleggsstønaderRolle,
    harNayUtlandRolle,
    harStrengtFortroligRolle,
    harTiltaksenhetenTilleggsstønaderRolle,
} from './roller';
import { Saksbehandler } from './saksbehandler';
import { Personopplysninger } from '../typer/personopplysninger';

export function kanBehandleTema(
    saksbehandler: Saksbehandler,
    forTema: 'TSO' | 'TSR',
    forSøker: Personopplysninger,
    forEnv: AppEnv
) {
    switch (forTema) {
        case 'TSO':
            return kanBehandleForNay(saksbehandler, forSøker, forEnv);
        case 'TSR':
            return kanBehandleForTiltaksenheten(saksbehandler, forSøker, forEnv);
        default:
            throw Error('Ukjent tema: ', forTema);
    }
}

export function kanBehandleForNay(
    saksbehandler: Saksbehandler,
    forSøker: Personopplysninger,
    forEnv: AppEnv
) {
    return (
        harNayTilleggsstønaderRolle(forEnv, saksbehandler) ||
        harNayEgenAnsattRolle(forEnv, saksbehandler) ||
        harNayUtlandRolle(forEnv, saksbehandler) ||
        (søkerHarStrengtFortroligAdresse(forSøker) &&
            harStrengtFortroligRolle(forEnv, saksbehandler))
    );
}

export function kanBehandleForTiltaksenheten(
    saksbehandler: Saksbehandler,
    forSøker: Personopplysninger,
    forEnv: AppEnv
) {
    return (
        harTiltaksenhetenTilleggsstønaderRolle(forEnv, saksbehandler) ||
        harEgenAnsattOsloRolle(forEnv, saksbehandler) ||
        (søkerHarStrengtFortroligAdresse(forSøker) &&
            harStrengtFortroligRolle(forEnv, saksbehandler))
    );
}
