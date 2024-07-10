import { useCallback, useState } from 'react';
import { Personopplysninger } from '../typer/personopplysninger';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';

export const useHentPersonopplysninger = (
    behandlingId: string
): {
    hentPersonopplysninger: (behandlingsid: string) => void;
    personopplysningerResponse: Ressurs<Personopplysninger>;
} => {
    const { request } = useApp();
    const [personopplysningerResponse, settPersonopplysningerResponse] =
        useState<Ressurs<Personopplysninger>>(byggTomRessurs());

    const hentPersonopplysninger = useCallback(() => {
        settPersonopplysningerResponse(byggHenterRessurs());
        request<Personopplysninger, { behandlingId: string }>(
            `/api/klage/personopplysninger/${behandlingId}`
        ).then(settPersonopplysningerResponse);
    }, [request, behandlingId]);

    return {
        hentPersonopplysninger,
        personopplysningerResponse,
    };
};
