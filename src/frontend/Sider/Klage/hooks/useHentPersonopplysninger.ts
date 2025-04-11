import { useCallback, useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { PersonopplysningerFraKlage } from '../typer/personopplysningerFraKlage';

export const useHentPersonopplysninger = (
    behandlingId: string
): {
    hentPersonopplysninger: (behandlingsid: string) => void;
    personopplysninger: Ressurs<PersonopplysningerFraKlage>;
} => {
    const { request } = useApp();
    const [personopplysninger, settPersonopplysninger] =
        useState<Ressurs<PersonopplysningerFraKlage>>(byggTomRessurs());

    const hentPersonopplysninger = useCallback(() => {
        settPersonopplysninger(byggHenterRessurs());
        request<PersonopplysningerFraKlage, { behandlingId: string }>(
            `/api/klage/personopplysninger/${behandlingId}`
        ).then(settPersonopplysninger);
    }, [request, behandlingId]);

    return {
        hentPersonopplysninger,
        personopplysninger,
    };
};
