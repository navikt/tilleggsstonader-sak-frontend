import React from 'react';

import Dokumentliste from './Dokumentliste';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useHentDokumenter } from '../../../../hooks/useHentDokumenter';
import DataViewer from '../../../../komponenter/DataViewer';
import { relevanteArkivtemaerIBehandling } from '../../../../typer/arkivtema';

const VEDLEGG_REQUEST = { tema: relevanteArkivtemaerIBehandling };

const Dokumentoversikt: React.FC = () => {
    const { behandling } = useBehandling();
    const dokumenter = useHentDokumenter(behandling.fagsakPersonId, VEDLEGG_REQUEST);

    return (
        <DataViewer type={'dokumenter'} response={{ dokumenter }}>
            {({ dokumenter }) => <Dokumentliste dokumenter={dokumenter} />}
        </DataViewer>
    );
};

export default Dokumentoversikt;
