import { useCallback, useState } from 'react';

import { hentMalerQuery, malQuery } from './Sanity/queries';
import { useSanityClient } from './Sanity/useSanityClient';
import { Brevmal, MalStruktur, BrevmalResultat } from './typer';
import { Stønadstype } from '../../typer/behandling/behandlingTema';
import {
    byggRessursFeilet,
    byggRessursSuksess,
    byggTomRessurs,
    Ressurs,
} from '../../typer/ressurs';
import { erProd } from '../../utils/miljø';

const stønadstypeTilSanityYtelse = (ytelse: Stønadstype) => {
    switch (ytelse) {
        case Stønadstype.BARNETILSYN:
            return 'BARNETILSYN';
        case Stønadstype.LÆREMIDLER:
            return 'LAREMIDLER';
        case Stønadstype.BOUTGIFTER:
            return 'BOUTGIFTER';
        default:
            return 'ikke-definiert';
    }
};

const useBrev = (ytelse: Stønadstype) => {
    const [brukDrafts, settBrukDrafts] = useState<boolean>(false);
    const sanityClient = useSanityClient(brukDrafts);

    const [brevmal, settBrevmal] = useState<string>();
    const [brevmaler, settBrevmaler] = useState<Ressurs<Brevmal[]>>(byggTomRessurs());
    const [malStruktur, settMalStruktur] = useState<Ressurs<MalStruktur>>(byggTomRessurs());
    const [fil, settFil] = useState<Ressurs<string>>(byggTomRessurs());

    const hentBrevmaler = useCallback(
        (resultat: BrevmalResultat[]) => {
            sanityClient
                .fetch<Brevmal[]>(hentMalerQuery(!erProd()), {
                    resultat: resultat,
                    ytelse: stønadstypeTilSanityYtelse(ytelse),
                })
                .then((data) => {
                    settBrevmaler(byggRessursSuksess(data));
                })
                .catch((error) => {
                    settBrevmaler(byggRessursFeilet(error.message));
                });
        },
        [sanityClient, ytelse]
    );

    const hentMalStruktur = useCallback(() => {
        if (brevmal) {
            const query = malQuery(brevmal);
            sanityClient
                .fetch<MalStruktur>(query)
                .then((data) => {
                    if (data !== null) {
                        // TODO
                        const dataMedGyldigeDelmaler: MalStruktur = {
                            ...data,
                            delmaler: data.delmaler.filter((delmal) => !!delmal._id),
                        };
                        settMalStruktur(byggRessursSuksess(dataMedGyldigeDelmaler));
                    }
                })
                .catch((error) => settMalStruktur(byggRessursFeilet(error.message)));
        }
    }, [sanityClient, brevmal]);

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
        brukDrafts,
        settBrukDrafts,
    };
};

export default useBrev;
