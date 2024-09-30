import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Heading, Table } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import DataViewer from '../../komponenter/DataViewer';
import { Behandling } from '../../typer/behandling/behandling';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';
import { formaterDato, formaterNullableIsoDatoTid } from '../../utils/dato';
import { formaterEnumVerdi } from '../../utils/tekstformatering';
import { Stønadsperiode } from '../Behandling/Inngangsvilkår/typer/stønadsperiode';

const Container = styled.div`
    margin: 2rem;
    width: 40rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

interface BehandlingForOppfølging {
    behandling: Behandling;
    stønadsperioderForKontroll: Stønadsperiode[];
}

const BehandlingerForOppfølging: React.FC = () => {
    const { request } = useApp();

    const [behandlingerForOppfølging, settBehandlingerForOppfølging] =
        useState<Ressurs<BehandlingForOppfølging[]>>(byggTomRessurs());

    useEffect(() => {
        request<BehandlingForOppfølging[], null>('/api/sak/oppfoelging/behandlinger').then(
            settBehandlingerForOppfølging
        );
    }, [request]);

    return (
        <Container>
            <Heading size={'medium'}>[Admin] Behandlinger som trenger oppfølging</Heading>
            <DataViewer response={{ behandlingerForOppfølging }}>
                {({ behandlingerForOppfølging }) => (
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Resultat</Table.HeaderCell>
                                <Table.HeaderCell>Vedtaksdato</Table.HeaderCell>
                                <Table.HeaderCell>
                                    Stønadsperioder som må kontrolleres
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {behandlingerForOppfølging.map((behandling) => (
                                <Table.Row key={behandling.behandling.id}>
                                    <Table.DataCell>
                                        <Link
                                            to={{
                                                pathname: `/behandling/${behandling.behandling.id}`,
                                            }}
                                        >
                                            {formaterEnumVerdi(behandling.behandling.resultat)}
                                        </Link>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterNullableIsoDatoTid(
                                            behandling.behandling.vedtaksdato
                                        )}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <ul>
                                            {behandling.stønadsperioderForKontroll.map(
                                                (stønadsperiode) => (
                                                    <li key={stønadsperiode.id}>
                                                        {formaterDato(stønadsperiode.fom)} -{' '}
                                                        {formaterDato(stønadsperiode.tom)}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </DataViewer>
        </Container>
    );
};

export default BehandlingerForOppfølging;
