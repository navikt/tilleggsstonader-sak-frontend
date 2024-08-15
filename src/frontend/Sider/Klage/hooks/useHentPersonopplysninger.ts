import { useCallback, useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { PersonopplysningerFraKlage } from '../typer/personopplysningerFraKlage';

export const useHentPersonopplysninger = (
    behandlingId: string
): {
    hentPersonopplysninger: (behandlingsid: string) => void;
    personopplysningerFraKlageResponse: Ressurs<PersonopplysningerFraKlage>;
} => {
    const { request } = useApp();
    const [personopplysningerFraKlageResponse, settPersonopplysningerFraKlageResponse] =
        useState<Ressurs<PersonopplysningerFraKlage>>(byggTomRessurs());

    const hentPersonopplysninger = useCallback(() => {
        settPersonopplysningerFraKlageResponse(byggHenterRessurs());
        request<PersonopplysningerFraKlage, { behandlingId: string }>(
            `/api/klage/personopplysninger/${behandlingId}`
        ).then(settPersonopplysningerFraKlageResponse);
    }, [request, behandlingId]);

    return {
        hentPersonopplysninger,
        personopplysningerFraKlageResponse: personopplysningerFraKlageResponse,
    };
};
