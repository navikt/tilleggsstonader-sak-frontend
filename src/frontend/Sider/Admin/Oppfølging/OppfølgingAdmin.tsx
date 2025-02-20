import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {
    BodyShort,
    Button,
    Checkbox,
    ErrorMessage,
    Heading,
    Table,
    Tag,
    VStack,
} from '@navikt/ds-react';

import { InformasjonOppfølging } from './InformasjonOppfølging';
import { KontrollerOppfølging } from './KontrollerOppfølging';
import { OppfølgingExpandableRowBody } from './OppfølgingExpandableRowBody';
import { OppfølgingKontrollertDetaljer } from './OppfølgingKontrollertDetaljer';
import { Oppfølging } from './oppfølgingTyper';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggHenterRessurs, Ressurs } from '../../../typer/ressurs';
import {
    erEtter,
    erEtterDagensDato,
    formaterIsoDato,
    formaterIsoDatoTid,
    førsteDagIMånederForut,
} from '../../../utils/dato';
import { StønadstypeTag } from '../../Behandling/Venstremeny/Oppsummering/StønadstypeTag';

const Container = styled.div`
    padding: 2rem;
    width: 70rem;
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

interface OppfølgingMedDetaljer extends Oppfølging {
    skalViseWarningTag: boolean;
}

/**
 * Skal vise warning hvis en kontroll påvirker en periode som endres i neste måned då vi ønsker å unngå tilbakekreving
 */
const skalViseWarningTag = (oppfølging: Oppfølging) =>
    oppfølging.data.perioderTilKontroll.some(
        (periode) =>
            erEtterDagensDato(periode.tom) &&
            [...periode.endringAktivitet, ...periode.endringMålgruppe].some(
                (endring) => endring.tom && erEtter(førsteDagIMånederForut(-2), endring.tom)
            )
    );

const oppfølgingMedDetaljer = (oppfølging: Oppfølging) => ({
    ...oppfølging,
    skalViseWarningTag: skalViseWarningTag(oppfølging),
});

export const OppfølgingTabell = ({ oppfølgingerInit }: { oppfølgingerInit: Oppfølging[] }) => {
    const [oppfølginger, settOppfølginger] = useState<OppfølgingMedDetaljer[]>(
        oppfølgingerInit.map(oppfølgingMedDetaljer)
    );
    const [oppfølgingForKontroll, settOppfølgingForKontroll] = useState<Oppfølging>();
    const [visKunManglerKontroll, settVisKunManglerKontroll] = useState(false);
    const [visKunWarningTag, settVisKunWarningTag] = useState(false);

    const [ekspanderteRader, settEkspanderteRader] = useState<Record<string, boolean>>(
        oppfølgingerInit
            .filter((oppfølging) => !oppfølging.kontrollert)
            .reduce(
                (acc, curr) => {
                    acc[curr.id] = true;
                    return acc;
                },
                {} as Record<string, boolean>
            )
    );

    const oppdaterOppfølging = (oppfølging: Oppfølging) => {
        settEkspanderteRader((prevState) => ({ ...prevState, [oppfølging.id]: false }));
        settOppfølginger((prevState) =>
            prevState.map((prevOppfølging) =>
                prevOppfølging.id === oppfølging.id
                    ? oppfølgingMedDetaljer(oppfølging)
                    : prevOppfølging
            )
        );
    };

    const filtrerteOppfølginger = oppfølginger
        .filter((oppfølging) => !visKunManglerKontroll || !oppfølging.kontrollert)
        .filter((oppfølging) => !visKunWarningTag || !oppfølging.skalViseWarningTag);
    return (
        <Container>
            <InformasjonOppfølging />
            {oppfølginger.length > 0 && (
                <Heading size={'small'}>
                    Kontroll opprettet: {formaterIsoDatoTid(oppfølginger[0].opprettetTidspunkt)}
                </Heading>
            )}
            <BodyShort>
                Viser {filtrerteOppfølginger.length} av {oppfølginger.length} oppfølginger
            </BodyShort>
            <Checkbox
                value={visKunManglerKontroll}
                onChange={() => settVisKunManglerKontroll((prevState) => !prevState)}
            >
                Vis kun de som mangler kontroll
            </Checkbox>
            <Checkbox
                title={'Viktige'}
                value={visKunWarningTag}
                onChange={() => settVisKunWarningTag((prevState) => !prevState)}
            >
                Vis kun viktige
            </Checkbox>
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
                    {filtrerteOppfølginger.map((oppfølging) => (
                        <Table.ExpandableRow
                            key={oppfølging.id}
                            togglePlacement={'right'}
                            content={<OppfølgingExpandableRowBody oppfølging={oppfølging} />}
                            expandOnRowClick={true}
                            open={ekspanderteRader[oppfølging.id] || false}
                            onOpenChange={() =>
                                settEkspanderteRader((prevState) => ({
                                    ...prevState,
                                    [oppfølging.id]: !prevState[oppfølging.id],
                                }))
                            }
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
                                        <ErrorMessage size={'small'}>
                                            Har nyere behandling
                                        </ErrorMessage>
                                    )}
                                    <Link
                                        to={{
                                            pathname: `/behandling/${oppfølging.behandlingId}`,
                                        }}
                                        target="_blank"
                                    >
                                        Gå til behandling
                                    </Link>
                                    <Link
                                        to={{
                                            pathname: `/person/${oppfølging.behandlingsdetaljer.fagsakPersonId}/behandlinger`,
                                        }}
                                        target="_blank"
                                    >
                                        Gå til behandlingsoversikt
                                    </Link>
                                </VStack>
                            </Table.DataCell>
                            <Table.DataCell>
                                {oppfølging.skalViseWarningTag && (
                                    <Tag variant={'warning'}>Viktig</Tag>
                                )}
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
