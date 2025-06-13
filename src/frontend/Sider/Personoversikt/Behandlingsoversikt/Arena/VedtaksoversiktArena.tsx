import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Heading, Table } from '@navikt/ds-react';

import { ArenaSakOgVedtak } from './vedtakArena';
import { Vedtaksdetaljer } from './Vedtaksdetaljer';
import { useApp } from '../../../../context/AppContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import { formaterNullableIsoDato, formaterNullablePeriode } from '../../../../utils/dato';

const Vedtakstabell = styled(Table)`
    max-width: 1200px;
`;

export const VedtaksoversiktArena: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [vedtakArena, settVedtakArena] = useState<Ressurs<ArenaSakOgVedtak>>(byggTomRessurs());

    useEffect(() => {
        request<ArenaSakOgVedtak, null>(`/api/sak/arena/vedtak/${fagsakPersonId}`).then(
            settVedtakArena
        );
    }, [request, fagsakPersonId]);

    return (
        <>
            <Heading size="small">Vedtak i Arena</Heading>
            <DataViewer type={'vedtaksperioder fra Arena'} response={{ vedtakArena }}>
                {({ vedtakArena }) => (
                    <Vedtakstabell size={'small'}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell scope="col">Rettighetstype</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Utfall</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Dato innstillt</Table.HeaderCell>
                                <Table.HeaderCell scope="col"></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {vedtakArena.vedtak.map((vedtak, index) => {
                                const sak = vedtakArena.saker[vedtak.sakId];
                                return (
                                    <Table.ExpandableRow
                                        key={index}
                                        content={<Vedtaksdetaljer vedtak={vedtak} sak={sak} />}
                                        togglePlacement={'right'}
                                    >
                                        <Table.DataCell>{vedtak.rettighet}</Table.DataCell>
                                        <Table.DataCell>{vedtak.type}</Table.DataCell>
                                        <Table.DataCell>{vedtak.utfall}</Table.DataCell>
                                        <Table.DataCell>
                                            {formaterNullablePeriode(vedtak.fom, vedtak.tom)}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {formaterNullableIsoDato(vedtak.datoInnstillt)}
                                        </Table.DataCell>
                                    </Table.ExpandableRow>
                                );
                            })}
                        </Table.Body>
                    </Vedtakstabell>
                )}
            </DataViewer>
        </>
    );
};
