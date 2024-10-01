import { useCallback, useState } from 'react';

import { hentMalerQuery, malQuery } from './Sanity/queries';
import { useSanityClient } from './Sanity/useSanityClient';
import { Brevmal, MalStruktur } from './typer';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import {
    byggRessursFeilet,
    byggRessursSuksess,
    byggTomRessurs,
    Ressurs,
} from '../../../typer/ressurs';
import { erProd } from '../../../utils/miljø';

const useBrev = (ytelse: Stønadstype) => {
    const sanityClient = useSanityClient();

    const [brevmal, settBrevmal] = useState<string>();
    const [brevmaler, settBrevmaler] = useState<Ressurs<Brevmal[]>>(byggTomRessurs());
    const [malStruktur, settMalStruktur] = useState<Ressurs<MalStruktur>>(byggTomRessurs());
    const [fil, settFil] = useState<Ressurs<string>>(byggTomRessurs());

    const hentBrevmaler = useCallback((resultat: string[]) => {
        sanityClient
            .fetch<Brevmal[]>(hentMalerQuery(!erProd()), {
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
        if (brevmal) {
            sanityClient
                .fetch<MalStruktur>(malQuery(brevmal))
                .then((data) => {
                    if (data !== null) {
                        settMalStruktur(byggRessursSuksess(data));
                    }
                })
                .catch((error) => settMalStruktur(byggRessursFeilet(error.message)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brevmal]);

    return {
        hentBrevmaler,
        hentMalStruktur,
        brevmaler,
        brevmal,
        settBrevmal,
        malStruktur,
        settMalStruktur,
        fil,
        settFil,
    };
};

export default useBrev;
