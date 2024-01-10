import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Heading, Table } from '@navikt/ds-react';

import ArkivtemaVelger from './ArkivtemaVelger';
import DokumentRad from './DokumentRad';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { DokumentInfo } from '../../../typer/dokument';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';

const FilterContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

type VedleggRequest = {
    tema?: string[]; // Arkiv
    journalposttype?: string;
    journalstatus?: string;
};

const Dokumentoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [dokumenter, settDokumenter] = useState<Ressurs<DokumentInfo[]>>(byggTomRessurs());
    const [vedleggRequest, settVedleggRequest] = useState<VedleggRequest>({});

    const hentDokumenter = useCallback(
        (fagsakPersonId: string) => {
            request<DokumentInfo[], VedleggRequest>(
                `/api/sak/vedlegg/fagsak-person/${fagsakPersonId}`,
                'POST',
                vedleggRequest
            ).then(settDokumenter);
        },
        [request, vedleggRequest]
    );

    useEffect(() => {
        hentDokumenter(fagsakPersonId);
    }, [fagsakPersonId, hentDokumenter]);

    const oppdaterValgteArkivtemaer = (option: string, isSelected: boolean) => {
        settVedleggRequest((prevVedleggRequest) => {
            if (isSelected) {
                return {
                    ...prevVedleggRequest,
                    tema: [...(prevVedleggRequest.tema || []), option],
                };
            } else {
                return {
                    ...prevVedleggRequest,
                    tema: (prevVedleggRequest.tema || []).filter((item) => item !== option),
                };
            }
        });
    };

    return (
        <>
            <Heading size="medium" level="1">
                Dokumentoversikt
            </Heading>
            <FilterContainer>
                <ArkivtemaVelger
                    valgteArkivtemaer={vedleggRequest.tema}
                    oppdaterValgteArkivtemaer={oppdaterValgteArkivtemaer}
                />
            </FilterContainer>
            <DataViewer response={{ dokumenter }}>
                {({ dokumenter }) => (
                    <Table size="small" zebraStripes>
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
        </>
    );
};

export default Dokumentoversikt;
