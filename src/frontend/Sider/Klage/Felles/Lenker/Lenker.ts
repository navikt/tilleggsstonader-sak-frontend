import { AppEnv } from '../../App/api/env';
// import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { AxiosError } from 'axios';
import { AxiosRequestCallback } from '../../App/typer/axiosRequest';
import { Ressurs, RessursStatus } from '../../familie-felles-frontend/familie-typer/ressurs';

export const lagAInntektLink = async (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string
): Promise<string> => {
    return await axiosRequest<string, null>({
        method: 'GET',
        url: `/familie-klage/api/inntekt/fagsak/${fagsakId}/generer-url`,
    })
        .then((response: Ressurs<string>) => {
            return response.status === RessursStatus.SUKSESS
                ? response.data
                : appEnv.eksternlenker.aInntekt;
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((_: AxiosError<string>) => {
            return appEnv.eksternlenker.aInntekt;
        });
};

export const lagGosysLink = (appEnv: AppEnv, personIdent: string) => {
    return `${appEnv.eksternlenker.gosys}/personoversikt/fnr=${personIdent}`;
};

export const lagModiaLink = (appEnv: AppEnv, personIdent: string): string => {
    return `${appEnv.eksternlenker.modia}/person/${personIdent}`;
};
