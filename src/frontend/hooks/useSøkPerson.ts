import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface PersonSøk {
    personIdent: string;
}

interface FunnetPerson {
    ident: string;
    behandlingId: string;
    navn: string;
}

export const usePersonsøk = (søkeident: string) => {
    const { request } = useApp();

    const [søkeresultat, settSøkeresultat] = useState(byggTomRessurs<FunnetPerson>());

    useEffect(() => {
        if (søkeident.replaceAll(' ', '')?.length === 11) {
            request<FunnetPerson, PersonSøk>('/api/sak/brevmottakere/person', 'POST', {
                personIdent: søkeident,
            }).then((resp: Ressurs<FunnetPerson>) => {
                settSøkeresultat(resp);
            });
        }
    }, [søkeident, request]);

    return { søkeresultat };
};
