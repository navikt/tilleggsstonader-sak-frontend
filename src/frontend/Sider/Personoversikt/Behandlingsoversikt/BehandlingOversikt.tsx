import React, { useEffect } from 'react';

import { FagsakOversikt } from './FagsakOversikt';
import { useHentFagsakPersonUtvidet } from '../../../hooks/useFagsakPerson';
import DataViewer from '../../../komponenter/DataViewer';

const Behandlingsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPersonUtvidet();

    useEffect(() => {
        hentFagsakPerson(fagsakPersonId);
    }, [fagsakPersonId, hentFagsakPerson]);

    return (
        <DataViewer response={{ fagsakPerson }}>
            {({ fagsakPerson }) => (
                <>
                    {fagsakPerson.barnetilsyn && (
                        <FagsakOversikt fagsak={fagsakPerson.barnetilsyn} />
                    )}
                </>
            )}
        </DataViewer>
    );
};

export default Behandlingsoversikt;
