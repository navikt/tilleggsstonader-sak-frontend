import React from 'react';

import { useParams } from 'react-router-dom';

import PersonoversiktInnhold from './PersonoversiktInnhold';

const Personoversikt = () => {
    const fagsakPersonId = useParams<{ fagsakPersonId: string }>().fagsakPersonId as string;

    return <PersonoversiktInnhold fagsakPersonId={fagsakPersonId} />;
};

export default Personoversikt;
