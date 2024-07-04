import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useCallback, useState } from 'react';
import { Personopplysninger } from '../typer/personopplysninger';
import { useApp } from '../context/AppContext';

export const useHentPersonopplysninger = (
    behandlingId: string
): {
    hentPersonopplysninger: (behandlingsid: string) => void;
    personopplysningerResponse: Ressurs<Personopplysninger>;
} => {
    const { axiosRequest } = useApp();
    const [personopplysningerResponse, settPersonopplysningerResponse] =
        useState<Ressurs<Personopplysninger>>(byggTomRessurs());

    const hentPersonopplysninger = useCallback(() => {
        settPersonopplysningerResponse(byggHenterRessurs());
        axiosRequest<Personopplysninger, { behandlingId: string }>({
            method: 'GET',
            url: `/api/klage/personopplysninger/${behandlingId}`,
        }).then((res) => {
            settPersonopplysningerResponse(res);
        });
    }, [axiosRequest, behandlingId]);

    return {
        hentPersonopplysninger,
        personopplysningerResponse,
    };
};