import { preferredAxios } from './axios';
import { ISaksbehandler } from '../typer/saksbehandler';
import { saksbehandlerDummyData } from './klage-stubs';

export const hentInnloggetBruker = (): Promise<ISaksbehandler> => {
    // return preferredAxios.get(`/user/profile`).then((response: { data: any }) => {
    //     return response.data;
    // });
    return Promise.resolve(saksbehandlerDummyData);
};
