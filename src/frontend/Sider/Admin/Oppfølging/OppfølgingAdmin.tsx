import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {
    BodyShort,
    Button,
    Checkbox,
    Detail,
    Heading,
    HStack,
    Tag,
    VStack,
} from '@navikt/ds-react';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';

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
    formaterIsoDatoTid,
    førsteDagIMånederForut,
} from '../../../utils/dato';
import { StønadstypeTag } from '../../Behandling/Venstremeny/Oppsummering/StønadstypeTag';

const Container = styled(VStack)`
    padding: 2rem;
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
    const [visKunManglerKontroll, settVisKunManglerKontroll] = useState(true);
    const [visKunWarningTag, settVisKunWarningTag] = useState(false);

    const oppdaterOppfølging = (oppfølging: Oppfølging) => {
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
        <Container gap={'4'}>
            <Heading size={'medium'}>[Admin] Oppfølging</Heading>
            <InformasjonOppfølging />
            <div>
                {oppfølginger.length > 0 && (
                    <Heading size={'small'}>
                        Kontroll opprettet: {formaterIsoDatoTid(oppfølginger[0].opprettetTidspunkt)}
                    </Heading>
                )}
                <BodyShort>
                    Viser {filtrerteOppfølginger.length} av {oppfølginger.length} oppfølginger
                </BodyShort>
            </div>
            <div>
                <Checkbox
                    value={visKunManglerKontroll}
                    size={'small'}
                    onChange={() => settVisKunManglerKontroll((prevState) => !prevState)}
                >
                    Vis kun de som mangler kontroll
                </Checkbox>
                <Checkbox
                    size={'small'}
                    value={visKunWarningTag}
                    onChange={() => settVisKunWarningTag((prevState) => !prevState)}
                >
                    Vis kun viktige
                </Checkbox>
            </div>
            <VStack gap={'8'} style={{ width: '70rem' }}>
                {filtrerteOppfølginger.map((oppfølging) => {
                    return (
                        <VStack
                            key={oppfølging.id}
                            gap={'4'}
                            justify={'space-between'}
                            style={{
                                border: `2px solid ${ABorderStrong}`,
                                padding: '1.5rem',
                                borderRadius: '10px',
                            }}
                        >
                            <HStack justify={'space-between'}>
                                <HStack gap={'4'} align={'start'} justify={'start'}>
                                    <StønadstypeTag
                                        stønadstype={oppfølging.behandlingsdetaljer.stønadstype}
                                    />
                                    <Detail>
                                        Saksnummer: {oppfølging.behandlingsdetaljer.saksnummer}
                                    </Detail>
                                    <Detail>
                                        Vedtakstidspunkt:{' '}
                                        {formaterIsoDatoTid(
                                            oppfølging.behandlingsdetaljer.vedtakstidspunkt
                                        )}
                                    </Detail>
                                </HStack>
                                <HStack>
                                    {oppfølging.behandlingsdetaljer.harNyereBehandling && (
                                        <Tag variant={'info'} size={'small'}>
                                            Har nyere behandling
                                        </Tag>
                                    )}
                                    {oppfølging.skalViseWarningTag && (
                                        <Tag variant={'warning'} size={'small'}>
                                            Viktig
                                        </Tag>
                                    )}
                                </HStack>
                            </HStack>
                            <HStack gap={'6'} align={'start'}>
                                <VStack gap={'4'}>
                                    <OppfølgingExpandableRowBody oppfølging={oppfølging} />
                                    <HStack gap={'4'} align={'start'} justify={'start'}>
                                        <Link
                                            to={{
                                                pathname: `/person/${oppfølging.behandlingsdetaljer.fagsakPersonId}/behandlinger`,
                                            }}
                                            target="_blank"
                                        >
                                            <BodyShort size={'small'}>
                                                Gå til behandlingsoversikt
                                            </BodyShort>
                                        </Link>
                                        <Link
                                            to={{
                                                pathname: `/behandling/${oppfølging.behandlingId}`,
                                            }}
                                            target="_blank"
                                        >
                                            <BodyShort size={'small'}>Gå til behandling</BodyShort>
                                        </Link>
                                    </HStack>
                                </VStack>
                                <HåndterKontroll
                                    oppfølging={oppfølging}
                                    oppfølgingForKontroll={oppfølgingForKontroll}
                                    settOppfølgingForKontroll={settOppfølgingForKontroll}
                                    oppdaterOppfølging={oppdaterOppfølging}
                                />
                            </HStack>
                        </VStack>
                    );
                })}
            </VStack>
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
            <Button
                onClick={() => settOppfølgingForKontroll(oppfølging)}
                size={'small'}
                variant={'secondary'}
            >
                Kontroller
            </Button>
        );
    }
    return null;
};
