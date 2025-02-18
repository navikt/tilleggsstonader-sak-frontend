import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Table } from '@navikt/ds-react';

import { OppfølgingModal } from './OppfølgingModal';
import { Oppfølging } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';

const Container = styled.div`
    margin: 1rem;
    width: 60rem;
`;

export const OppølgingAdmin = () => {
    const { request } = useApp();

    const [oppfølginger, settOppføginger] = useState<Ressurs<Oppfølging[]>>(byggHenterRessurs());

    useEffect(() => {
        request<Oppfølging[], null>(`/api/sak/oppfolging`).then(settOppføginger);
    }, [request]);

    return (
        <DataViewer response={{ oppfølginger }}>
            {({ oppfølginger }) => <OppfølgingTabell oppfølginger={oppfølginger} />}
        </DataViewer>
    );
};

export const OppfølgingTabell = ({ oppfølginger }: { oppfølginger: Oppfølging[] }) => {
    const [oppføgingForKontroll, settOppføgingForKontroll] = useState<Oppfølging>();

    return (
        <Container>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope={'col'}>Behandling</Table.HeaderCell>
                        <Table.HeaderCell scope={'col'}>Kontroller</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {oppfølginger.map((oppfølging) => (
                        <Table.Row key={oppfølging.id}>
                            <Table.DataCell>
                                <Link
                                    to={{
                                        pathname: `/behandling/${oppfølging.behandlingId}`,
                                    }}
                                    target="_blank"
                                >
                                    Gå til behandling
                                </Link>
                            </Table.DataCell>
                            <Table.DataCell>
                                <Button onClick={() => settOppføgingForKontroll(oppfølging)}>
                                    Kontroller
                                </Button>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {oppføgingForKontroll && (
                <OppfølgingModal
                    oppfølging={oppføgingForKontroll}
                    lukkModal={() => settOppføgingForKontroll(undefined)}
                />
            )}
        </Container>
    );
};
