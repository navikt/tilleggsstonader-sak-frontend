import React, { useEffect } from 'react';

import { FagsakOversikt } from './FagsakOversikt';
import { useHentFagsakPersonUtvidet } from '../../../hooks/useFagsakPerson';
import { useHentKlagebehandlinger } from '../../../hooks/useKlagebehandlinger';
import DataViewer from '../../../komponenter/DataViewer';

const Behandlingsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPersonUtvidet();
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();

    useEffect(() => {
        hentFagsakPerson(fagsakPersonId);
        hentKlagebehandlinger(fagsakPersonId);
    }, [fagsakPersonId, hentFagsakPerson, hentKlagebehandlinger]);

    const rekjørHentKlagebehandlinger = () => hentKlagebehandlinger(fagsakPersonId);

    return (
        <DataViewer response={{ fagsakPerson, klagebehandlinger }}>
            {({ fagsakPerson, klagebehandlinger }) => (
                <>
                    {fagsakPerson.tilsynBarn && (
                        <FagsakOversikt
                            fagsak={fagsakPerson.tilsynBarn}
                            klagebehandlinger={klagebehandlinger.barnetilsyn}
                            hentKlagebehandlinger={rekjørHentKlagebehandlinger}
                        />
                    )}
                </>
            )}
        </DataViewer>
    );
};

export default Behandlingsoversikt;
