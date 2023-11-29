import { useCallback, useEffect, useState } from 'react';

import { Brevmottakere } from './Brevmottakere/brevmottakereTyper';
import { hentMalerQuery, malQuery } from './Sanity/queries';
import { useSanityClient } from './Sanity/useSanityClient';
import { Brevmal, MalStruktur } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import {
    byggRessursFeilet,
    byggRessursSuksess,
    byggTomRessurs,
    Ressurs,
} from '../../../typer/ressurs';

const useBrev = (ytelse: Stønadstype, resultat: string) => {
    const sanityClient = useSanityClient();
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [brevmal, settBrevmal] = useState<string>();
    const [brevmaler, settBrevmaler] = useState<Ressurs<Brevmal[]>>(byggTomRessurs());
    const [malStruktur, settMalStruktur] = useState<Ressurs<MalStruktur>>(byggTomRessurs());
    const [brevmottakere, settBrevmottakere] = useState<Ressurs<Brevmottakere>>(byggTomRessurs());

    const hentBrevmaler = useCallback(() => {
        sanityClient
            .fetch<Brevmal[]>(hentMalerQuery, {
                ytelse: ytelse,
                resultat: resultat,
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
                .then((data) => settMalStruktur(byggRessursSuksess(data)))
                .catch((error) => settMalStruktur(byggRessursFeilet(error.message)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brevmal]);

    const hentBrevmottakere = useCallback(() => {
        request<Brevmottakere, unknown>(`/api/sak/brevmottakere/${behandling.id}`).then(
            settBrevmottakere
        );
    }, [request, behandling.id]);

    useEffect(hentBrevmaler, [hentBrevmaler]);
    useEffect(hentMalStruktur, [hentMalStruktur]);
    useEffect(hentBrevmottakere, [hentBrevmottakere]);

    return {
        brevmaler,
        brevmal,
        settBrevmal,
        malStruktur,
        brevmottakere,
    };
};

export default useBrev;
