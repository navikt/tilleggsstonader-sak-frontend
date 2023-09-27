import { useCallback, useEffect, useState } from 'react';

import { hentMalerQuery } from './Sanity/queries';
import { useSanityClient } from './Sanity/useSanityClient';
import { Brevmal } from './typer';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import {
    byggRessursFeilet,
    byggRessursSuksess,
    byggTomRessurs,
    Ressurs,
} from '../../../typer/ressurs';

const useBrev = (ytelse: Stønadstype, resultat: string) => {
    const sanityClient = useSanityClient();

    const [brevmal, settBrevmal] = useState<string>();
    const [brevmaler, settBrevmaler] = useState<Ressurs<Brevmal[]>>(byggTomRessurs());

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

    useEffect(hentBrevmaler, [hentBrevmaler]);

    return {
        brevmaler,
        brevmal,
        settBrevmal,
    };
};

export default useBrev;
