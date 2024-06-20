import { useCallback, useEffect, useState } from 'react';

import { Brevmottakere } from './Brevmottakere/brevmottakereTyper';
import { hentMalerQuery, malQuery } from './Sanity/queries';
import { useSanityClient } from './Sanity/useSanityClient';
import { Brevmal, MalStruktur } from './typer';
import { useApp } from '../../../context/AppContext';
import { KlageBehandling } from '../../../typer/behandling/klageBehandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import {
    byggRessursFeilet,
    byggRessursSuksess,
    byggTomRessurs,
    Ressurs,
} from '../../../typer/ressurs';

const useBrev = (ytelse: Stønadstype, behandling?: KlageBehandling) => {
    const sanityClient = useSanityClient();
    const { request } = useApp();

    const [brevmal, settBrevmal] = useState<string>();
    const [brevmaler, settBrevmaler] = useState<Ressurs<Brevmal[]>>(byggTomRessurs());
    const [malStruktur, settMalStruktur] = useState<Ressurs<MalStruktur>>(byggTomRessurs());
    const [brevmottakere, settBrevmottakere] = useState<Ressurs<Brevmottakere>>(byggTomRessurs());
    const [fil, settFil] = useState<Ressurs<string>>(byggTomRessurs());

    const hentBrevmaler = useCallback((resultat: string) => {
        sanityClient
            .fetch<Brevmal[]>(hentMalerQuery, {
                resultat: resultat,
                ytelse: ytelse,
            })
            .then((data) => {
                settBrevmaler(byggRessursSuksess(data));
            })
            .catch((error) => {
                settBrevmaler(byggRessursFeilet(error.message));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hentMalStruktur = useCallback(() => {
        brevmal &&
            sanityClient
                .fetch<MalStruktur>(malQuery(brevmal))
                .then((data) => data !== null && settMalStruktur(byggRessursSuksess(data)))
                .catch((error) => settMalStruktur(byggRessursFeilet(error.message)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brevmal]);

    const hentBrevmottakere = useCallback(() => {
        if (behandling) {
            request<Brevmottakere, unknown>(`/api/sak/brevmottakere/${behandling.id}`).then(
                settBrevmottakere
            );
        }
    }, [request, behandling]);

    useEffect(hentBrevmottakere, [hentBrevmottakere]);

    return {
        hentBrevmaler,
        hentMalStruktur,
        brevmaler,
        brevmal,
        settBrevmal,
        malStruktur,
        settMalStruktur,
        brevmottakere,
        fil,
        settFil,
    };
};

export default useBrev;
