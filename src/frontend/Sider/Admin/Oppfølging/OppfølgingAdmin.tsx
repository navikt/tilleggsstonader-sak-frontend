import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Heading, Table, VStack } from '@navikt/ds-react';

import { KontrollerOppfølgning } from './KontrollerOppfølgning';
import { OppfølgingExpandableRowBody } from './OppfølgingExpandableRowBody';
import { OppfølgingKontrollertDetaljer } from './OppfølgingKontrollertDetaljer';
import { Oppfølging } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';
import { formaterIsoDato, formaterIsoDatoTid } from '../../../utils/dato';
import { StønadstypeTag } from '../../Behandling/Venstremeny/Oppsummering/StønadstypeTag';

const Container = styled.div`
    margin: 1rem;
    width: 60rem;
`;

const WidthMaxContent = styled.div`
    width: max-content;
`;

export const OppølgingAdmin = () => {
    const { request } = useApp();

    const [oppfølginger, settOppføginger] = useState<Ressurs<Oppfølging[]>>(byggHenterRessurs());

    useEffect(() => {
        request<Oppfølging[], null>(`/api/sak/oppfolging`).then(settOppføginger);
    }, [request]);

    return (
        <DataViewer response={{ oppfølginger }}>
            {({ oppfølginger }) => <OppfølgingTabell oppfølgingerInit={oppfølginger} />}
        </DataViewer>
    );
};

export const OppfølgingTabell = ({ oppfølgingerInit }: { oppfølgingerInit: Oppfølging[] }) => {
    const [oppfølginger, settOppfølginger] = useState<Oppfølging[]>(oppfølgingerInit);
    const [oppføgingForKontroll, settOppføgingForKontroll] = useState<Oppfølging>();

    const oppdaterOppfølging = (oppfølging: Oppfølging) => {
        settOppfølginger((prevState) =>
            prevState.map((prevOppfølging) =>
                prevOppfølging.id === oppfølging.id ? oppfølging : prevOppfølging
            )
        );
    };

    return (
        <Container>
            {oppfølginger.length > 0 && (
                <Heading size={'medium'}>
                    Kontroll opprettet: {formaterIsoDatoTid(oppfølginger[0].opprettetTidspunkt)}
                </Heading>
            )}
            <Table size={'medium'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope={'col'} style={{ width: '20rem' }}>
                            Behandling
                        </Table.HeaderCell>
                        <Table.HeaderCell scope={'col'}>Kontroller</Table.HeaderCell>
                        <Table.HeaderCell scope={'col'}>Se detaljer</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {oppfølginger.map((oppfølging) => (
                        <Table.ExpandableRow
                            key={oppfølging.id}
                            togglePlacement={'right'}
                            content={<OppfølgingExpandableRowBody oppfølging={oppfølging} />}
                            expandOnRowClick={true}
                        >
                            <Table.DataCell>
                                <VStack>
                                    <WidthMaxContent>
                                        <StønadstypeTag stønadstype={oppfølging.data.stønadstype} />
                                    </WidthMaxContent>

                                    <span>
                                        Vedtakstidspunkt:{' '}
                                        {formaterIsoDato(oppfølging.data.vedtakstidspunkt)}
                                    </span>
                                    {oppfølging.harNyereBehandling && (
                                        <span>Har nyere behandling</span>
                                    )}
                                    <Link
                                        to={{
                                            pathname: `/behandling/${oppfølging.behandlingId}`,
                                        }}
                                        target="_blank"
                                    >
                                        Gå til behandling
                                    </Link>
                                </VStack>
                            </Table.DataCell>
                            <Table.DataCell>
                                {oppfølging.kontrollert && (
                                    <OppfølgingKontrollertDetaljer
                                        kontrollert={oppfølging.kontrollert}
                                    />
                                )}
                                {!oppfølging.kontrollert &&
                                    oppføgingForKontroll?.id === oppfølging.id && (
                                        <KontrollerOppfølgning
                                            oppfølging={oppfølging}
                                            avbryt={() => settOppføgingForKontroll(undefined)}
                                            oppdaterOppfølging={oppdaterOppfølging}
                                        />
                                    )}
                                {!oppfølging.kontrollert && !oppføgingForKontroll && (
                                    <WidthMaxContent>
                                        <Button
                                            onClick={() => settOppføgingForKontroll(oppfølging)}
                                            size={'small'}
                                            variant={'secondary'}
                                        >
                                            Kontroller
                                        </Button>
                                    </WidthMaxContent>
                                )}
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </Table>
        </Container>
    );
};
