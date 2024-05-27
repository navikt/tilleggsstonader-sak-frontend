import { preferredAxios } from './axios';
import { Roller } from '../../utils/roller';
import { Eksternlenker } from '../typer/eksternlenker';
// import { Roller } from '../utils/roller';
// import { Eksternlenker } from '../typer/eksternlenker';

export interface AppEnv {
    roller: Roller;
    miljø: string;
    eksternlenker: Eksternlenker;
}

export const hentEnv = (): Promise<AppEnv> => {
    return preferredAxios.get(`/env`).then((response) => {
        return response.data;
    });
};
