import { useCallback, useState } from 'react';
import { Personopplysninger } from '../App/typer/personopplysninger';
import { useKlageApp } from '../context/KlageAppContext';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';

export const useHentPersonopplysninger = (
    behandlingId: string
): {
    hentPersonopplysninger: (behandlingsid: string) => void;
    personopplysningerResponse: Ressurs<Personopplysninger>;
} => {
    const { axiosRequest } = useKlageApp();
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