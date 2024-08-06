import React, { useEffect, useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { relevanteArkivtemaer } from '../../../../typer/arkivtema';
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
                tema: relevanteArkivtemaer,
            }
        ).then(settDokumenter);
    }, [request, behandling]);

    return (
        <DataViewer response={{ dokumenter }}>
            {({ dokumenter }) => (
                <ul>
                    {dokumenter.map((dokument, index) => (
                        <li key={dokument.journalpostId + index}>{dokument.tittel}</li>
                    ))}
                </ul>
            )}
        </DataViewer>
    );
};

export default Dokumentoversikt;
