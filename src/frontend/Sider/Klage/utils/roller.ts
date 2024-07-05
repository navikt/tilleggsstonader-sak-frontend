export type SaksbehadlerRolle = 'veileder' | 'saksbehandler' | 'beslutter';
export type Rolle = SaksbehadlerRolle | 'kode6' | 'kode7';

/**
 * Mapper rolle til gruppe
 */
export type Roller = {
    [key in Rolle]: string;
};
