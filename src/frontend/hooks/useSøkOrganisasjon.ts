import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { byggTomRessurs } from '../typer/ressurs';

interface Organisasjon {
    navn: string;
    organisasjonsnummer: string;
}

export const useOrganisasjonssøk = (organisasjonsnummer: string) => {
    const { request } = useApp();

    const [søkeresultat, settSøkeressultat] = useState(byggTomRessurs<Organisasjon>());

    useEffect(() => {
        if (organisasjonsnummer?.length === 9) {
            request<Organisasjon, null>(
                `/api/sak/brevmottakere/organisasjon/${organisasjonsnummer}`
            ).then(settSøkeressultat);
        }
    }, [organisasjonsnummer, request]);

    return { søkeresultat };
};
