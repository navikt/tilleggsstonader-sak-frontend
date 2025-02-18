import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { BodyShort, Button, Heading, List, Table, VStack } from '@navikt/ds-react';

import { KontrollerOppfølging } from './KontrollerOppfølging';
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

const LiteUtenMargins = styled(List)`
    ul {
        margin-block: 0;
        margin-bottom: 0;
    }
    li {
        margin-block-end: 0;
    }
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
            <Heading size={'medium'}>[Admin] Oppfølging</Heading>
            <VStack gap={'2'}>
                <BodyShort>Her vises behadlinger som trenger oppfølging</BodyShort>
                <BodyShort size={'small'}>
                    En behandling kan ha en eller flere årsaker til oppfølging:
                </BodyShort>
                <LiteUtenMargins size={'small'}>
                    <List.Item>Ingen treff mot registeret</List.Item>
                    <List.Item>Fom er endret</List.Item>
                    <List.Item>Tom er endret</List.Item>
                    <List.Item>Feil type aktivitet</List.Item>
                </LiteUtenMargins>
                <BodyShort size={'small'}>
                    Hver rad inneholder lenke til behandling. Hver rad viser kan ekspanderes for å
                    vise mer detaljer om hvilke perioder som har endret seg.
                </BodyShort>
                <BodyShort size={'small'} spacing>
                    Hvis du er usikker, spør på teams.
                </BodyShort>
            </VStack>
            {oppfølginger.length > 0 && (
                <Heading size={'small'}>
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
                                        <StønadstypeTag
                                            stønadstype={oppfølging.behandlingsdetaljer.stønadstype}
                                        />
                                    </WidthMaxContent>
                                    <span>
                                        Saksnummer: {oppfølging.behandlingsdetaljer.saksnummer}
                                    </span>
                                    <span>
                                        Vedtakstidspunkt:{' '}
                                        {formaterIsoDato(
                                            oppfølging.behandlingsdetaljer.vedtakstidspunkt
                                        )}
                                    </span>
                                    {oppfølging.behandlingsdetaljer.harNyereBehandling && (
                                        <span>Har nyere behandling</span>
                                    )}
                                    <Link
                                        to={{
                                            pathname: `/person/${oppfølging.behandlingsdetaljer.fagsakPersonId}`,
                                        }}
                                        target="_blank"
                                    >
                                        Gå til behandlingsoversikt
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
            <KontrollerOppfølging
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
