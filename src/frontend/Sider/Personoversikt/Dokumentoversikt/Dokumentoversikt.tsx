import React, { useCallback, useEffect, useState } from 'react';

import { Heading } from '@navikt/ds-react';

import { DokumentTabell } from './DokumentTabell';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { DokumentInfo, Tema } from '../../../typer/dokument';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';

type VedleggRequest = {
    tema?: Tema[]; // Arkiv
    journalposttype?: string;
    journalstatus?: string;
};

const Dokumentoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [dokumenter, settDokumenter] = useState<Ressurs<DokumentInfo[]>>(byggTomRessurs());

    const hentDokumenter = useCallback(
        (fagsakPersonId: string) => {
            request<DokumentInfo[], VedleggRequest>(
                `/api/sak/vedlegg/fagsak-person/${fagsakPersonId}`,
                'POST',
                { tema: [Tema.TSO, Tema.TSR] }
            ).then(settDokumenter);
        },
        [request]
    );

    useEffect(() => {
        hentDokumenter(fagsakPersonId);
    }, [fagsakPersonId, hentDokumenter]);

    return (
        <>
            <Heading size="medium" level="1">
                Dokumentoversikt
            </Heading>
            <DataViewer response={{ dokumenter }}>
                {({ dokumenter }) => <DokumentTabell dokumenter={dokumenter} />}
            </DataViewer>
        </>
    );
};

export default Dokumentoversikt;
