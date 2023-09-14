import React from 'react';

import { useParams } from 'react-router-dom';

import BehandlingInnhold from './BehandlingInnhold';

const BehandlingContainer = () => {
    const behandlingId = useParams<{ fagsakPersonId: string }>().fagsakPersonId as string;

    return <BehandlingInnhold behandlingId={behandlingId} />;
};

export default BehandlingContainer;
