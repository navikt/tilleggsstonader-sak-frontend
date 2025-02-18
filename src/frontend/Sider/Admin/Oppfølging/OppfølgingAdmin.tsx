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
    const [oppfølgingForKontroll, settOppfølgingForKontroll] = useState<Oppfølging>();

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
                                <HåndterKontroll
                                    oppfølging={oppfølging}
                                    oppfølgingForKontroll={oppfølgingForKontroll}
                                    settOppfølgingForKontroll={settOppfølgingForKontroll}
                                    oppdaterOppfølging={oppdaterOppfølging}
                                />
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </Table>
        </Container>
    );
};

const HåndterKontroll = ({
    oppfølging,
    oppfølgingForKontroll,
    settOppfølgingForKontroll,
    oppdaterOppfølging,
}: {
    oppfølging: Oppfølging;
    oppfølgingForKontroll: Oppfølging | undefined;
    settOppfølgingForKontroll: (oppfølging: Oppfølging | undefined) => void;
    oppdaterOppfølging: (oppfølging: Oppfølging) => void;
}) => {
    if (oppfølging.kontrollert) {
        return <OppfølgingKontrollertDetaljer kontrollert={oppfølging.kontrollert} />;
    }
    if (oppfølgingForKontroll?.id === oppfølging.id) {
        return (
            <KontrollerOppfølgning
                oppfølging={oppfølging}
                avbryt={() => settOppfølgingForKontroll(undefined)}
                oppdaterOppfølging={oppdaterOppfølging}
            />
        );
    }
    if (!oppfølgingForKontroll) {
        return (
            <WidthMaxContent>
                <Button
                    onClick={() => settOppfølgingForKontroll(oppfølging)}
                    size={'small'}
                    variant={'secondary'}
                >
                    Kontroller
                </Button>
            </WidthMaxContent>
        );
    }
    return null;
};
