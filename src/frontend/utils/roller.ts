import { AppEnv } from './env';
import { Saksbehandler } from './saksbehandler';

export type SaksbehadlerRolle = 'veileder' | 'saksbehandler' | 'beslutter';
type NayUtland = 'NayUtland'; // NayRomerike håndterer utlandssaker
export type Rolle = SaksbehadlerRolle | 'kode6' | 'kode7' | 'egenAnsatt' | NayUtland;

/**
 * Mapper rolle til gruppe
 */
export type Roller = {
    [key in Rolle]: string;
};

/**
 * Sjekker om saksbehandler har minimum den tilgangen som kreves for gitt rolle
 */
export const harTilgangTilRolle = (
    env: AppEnv,
    saksbehandler: Saksbehandler,
    minimumsrolle: SaksbehadlerRolle
): boolean => {
    const saksbehandlerGrupper = saksbehandler.groups;
    if (!saksbehandlerGrupper) return false;
    let rollerForBruker: string[];
    if (saksbehandlerGrupper.indexOf(env.roller['beslutter']) > -1) {
        rollerForBruker = [env.roller.beslutter, env.roller.saksbehandler, env.roller.veileder];
    } else if (saksbehandlerGrupper.indexOf(env.roller['saksbehandler']) > -1) {
        rollerForBruker = [env.roller.saksbehandler, env.roller.veileder];
    } else if (saksbehandlerGrupper.indexOf(env.roller['veileder']) > -1) {
        rollerForBruker = [env.roller.veileder];
    } else {
        rollerForBruker = [];
    }

    return rollerForBruker.indexOf(env.roller[minimumsrolle]) > -1;
};

export const harStrengtFortroligRolle = (env: AppEnv, saksbehandler: Saksbehandler): boolean => {
    return harRolle(env, saksbehandler, 'kode6');
};

export const harEgenAnsattRolle = (env: AppEnv, saksbehandler: Saksbehandler): boolean => {
    return harRolle(env, saksbehandler, 'egenAnsatt');
};

export const harNayUtlandRolle = (env: AppEnv, saksbehandler: Saksbehandler): boolean => {
    return harRolle(env, saksbehandler, 'NayUtland');
};

const harRolle = (env: AppEnv, saksbehandler: Saksbehandler, rolle: Rolle) => {
    const saksbehandlerGrupper = saksbehandler.groups;
    if (!saksbehandlerGrupper) return false;
    return saksbehandlerGrupper.some((gruppe) => gruppe === env.roller[rolle]);
};
