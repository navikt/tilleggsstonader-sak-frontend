import React, { useCallback, useEffect, useState } from 'react';

import { Table } from '@navikt/ds-react';

import DokumentRad from './DokumentRad';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { DokumentInfo } from '../../../typer/dokument';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';

type VedleggRequest = {
    fagsakPersonId: string;
    tema?: string[]; // Arkiv
    journalposttype?: string;
    journalstatus?: string;
};

const Dokumentoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [dokumenter, settDokumenter] = useState<Ressurs<DokumentInfo[]>>(byggTomRessurs());

    const hentDokumenter = useCallback(
        (fagsakPersonId: string) => {
            request<DokumentInfo[], VedleggRequest>(`/api/sak/vedlegg/fagsak-person`, 'POST', {
                fagsakPersonId: fagsakPersonId,
            }).then(settDokumenter);
        },
        [request]
    );

    useEffect(() => {
        hentDokumenter(fagsakPersonId);
    }, [fagsakPersonId, hentDokumenter]);

    return (
        <DataViewer response={{ dokumenter }}>
            {({ dokumenter }) => (
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Dato</Table.HeaderCell>
                            <Table.HeaderCell>Inn/ut</Table.HeaderCell>
                            <Table.HeaderCell>Tittel</Table.HeaderCell>
                            <Table.HeaderCell>Avsender/mottaker</Table.HeaderCell>
                            <Table.HeaderCell>Tema</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {dokumenter.map((dokument) => (
                            <DokumentRad dokument={dokument} />
                        ))}
                    </Table.Body>
                </Table>
            )}
        </DataViewer>
    );
};

export default Dokumentoversikt;
