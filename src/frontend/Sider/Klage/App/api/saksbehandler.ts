import { preferredAxios } from './axios';
import { ISaksbehandler } from '../typer/saksbehandler';

export const hentInnloggetBruker = (): Promise<ISaksbehandler> => {
    return preferredAxios.get(`/user/profile`).then((response: { data: any }) => {
        // TODO: Sett opp dette endepunktet (eller finn et annet)
        return response.data;
    });
};
