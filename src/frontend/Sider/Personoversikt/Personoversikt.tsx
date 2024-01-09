import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import PersonoversiktInnhold from './PersonoversiktInnhold';
import { useApp } from '../../context/AppContext';
import { PersonopplysningerProvider } from '../../context/PersonopplysningerContext';
import DataViewer from '../../komponenter/DataViewer';
import PersonHeader from '../../komponenter/PersonHeader/PersonHeader';
import { Personopplysninger } from '../../typer/personopplysninger';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';

const Personoversikt = () => {
    const { request } = useApp();

    const fagsakPersonId = useParams<{ fagsakPersonId: string }>().fagsakPersonId as string;

    const [personopplysninger, settPersonopplysninger] = useState<Ressurs<Personopplysninger>>(
        byggTomRessurs()
    );

    useEffect(() => {
        request<Personopplysninger, null>(
            `/api/sak/personopplysninger/fagsak-person/${fagsakPersonId}`
        ).then(settPersonopplysninger);
    }, [request, fagsakPersonId]);

    return (
        <DataViewer response={{ personopplysninger }}>
            {({ personopplysninger }) => (
                <PersonopplysningerProvider personopplysninger={personopplysninger}>
                    <PersonHeader />
                    <PersonoversiktInnhold fagsakPersonId={fagsakPersonId} />
                </PersonopplysningerProvider>
            )}
        </DataViewer>
    );
};

export default Personoversikt;
