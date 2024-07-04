import { preferredAxios } from './axios';
import { Roller } from '../../utils/roller';

export interface AppEnv {
    roller: Roller;
    miljø: string;
}

export const hentEnv = (): Promise<AppEnv> => {
    return preferredAxios.get(`/env`).then((response) => {
        return response.data;
    });
};
