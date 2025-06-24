import React, { useEffect, useState } from 'react';

import Dokumentliste from './Dokumentliste';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { relevanteArkivtemaerIBehandling } from '../../../../typer/arkivtema';
import { DokumentInfo, VedleggRequest } from '../../../../typer/dokument';
import { Ressurs, byggTomRessurs } from '../../../../typer/ressurs';

const Dokumentoversikt: React.FC = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [dokumenter, settDokumenter] = useState<Ressurs<DokumentInfo[]>>(byggTomRessurs());

    useEffect(() => {
        request<DokumentInfo[], VedleggRequest>(
            `/api/sak/vedlegg/fagsak-person/${behandling.fagsakPersonId}`,
            'POST',
            {
                tema: relevanteArkivtemaerIBehandling,
            }
        ).then(settDokumenter);
    }, [request, behandling]);

    return (
        <DataViewer type={'dokumenter'} response={{ dokumenter }}>
            {({ dokumenter }) => <Dokumentliste dokumenter={dokumenter} />}
        </DataViewer>
    );
};

export default Dokumentoversikt;
