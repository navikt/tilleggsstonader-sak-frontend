import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { BodyLong, Button, Table, VStack } from '@navikt/ds-react';

import { OppfølgingModal } from './OppfølgingModal';
import { Oppfølging, oppfølgingUtfallTilTekst } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';
import { formaterIsoDato, formaterIsoDatoTid } from '../../../utils/dato';
import { StønadstypeTag } from '../../Behandling/Venstremeny/Oppsummering/StønadstypeTag';

const Container = styled.div`
    margin: 1rem;
    width: 60rem;
`;

const Kommentar = styled(BodyLong)`
    white-space: pre-wrap;
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
            {({ oppfølginger }) => <OppfølgingTabell oppfølginger={oppfølginger} />}
        </DataViewer>
    );
};

export const OppfølgingTabell = ({ oppfølginger }: { oppfølginger: Oppfølging[] }) => {
    const [oppføgingForKontroll, settOppføgingForKontroll] = useState<Oppfølging>();

    return (
        <Container>
            <Table size={'medium'}>
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
                                {oppfølging.kontrollert ? (
                                    <OppfølgingKontrollert kontrollert={oppfølging.kontrollert} />
                                ) : (
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

export const OppfølgingKontrollert = ({
    kontrollert,
}: {
    kontrollert: NonNullable<Oppfølging['kontrollert']>;
}) => {
    return (
        <VStack>
            <span>
                Kontrollert: {formaterIsoDatoTid(kontrollert.tidspunkt)} av{' '}
                {kontrollert.saksbehandler}
            </span>
            <span>Utfall: {oppfølgingUtfallTilTekst[kontrollert.utfall]}</span>
            <Kommentar>Kommentar: {oppfølgingUtfallTilTekst[kontrollert.utfall]}</Kommentar>
        </VStack>
    );
};
