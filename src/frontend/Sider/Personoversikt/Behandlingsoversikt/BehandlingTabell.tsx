import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { HStack, Table, Tooltip } from '@navikt/ds-react';
import { BorderNeutral } from '@navikt/ds-tokens/darkside-js';

import HenlagtÅrsakOgBegrunnelse from './HenlagtÅrsakOgBegrunnelse';
import { BehandlingResultat } from '../../../typer/behandling/behandlingResultat';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { PartialRecord } from '../../../typer/common';
import {
    erKlageOgFeilregistrertAvKA,
    TabellBehandling,
    utledBehandlingResultatTilTekst,
} from '../../../utils/behandlingutil';
import {
    formaterIsoDatoTid,
    formaterNullableIsoDato,
    formaterNullableIsoDatoTid,
} from '../../../utils/dato';
import { formaterEnumVerdi } from '../../../utils/tekstformatering';

const Tabell = styled(Table)`
    max-width: fit-content;
    border: 1px solid ${BorderNeutral};
    margin-left: 10px;
`;

const AdvarselIkon = styled(ExclamationmarkTriangleIcon)`
    margin-left: 1rem;
`;

const TabellData: PartialRecord<keyof TabellBehandling, string> = {
    opprettet: 'Opprettet',
    type: 'Type',
    resultat: 'Resultat',
    vedtaksperiode: 'Vedtaksperiode',
    behandlingsårsak: 'Årsak',
    status: 'Status',
    vedtaksdato: 'Vedtaksdato',
};

interface Props {
    tabellbehandlinger: TabellBehandling[];
}

const BehandlingTabell: React.FC<Props> = ({ tabellbehandlinger }) => {
    const utledUrl = (type: BehandlingType) =>
        type === BehandlingType.KLAGE ? '/klagebehandling' : '/behandling';

    return (
        <>
            <Tabell size="small">
                <Table.Header>
                    <Table.Row>
                        {Object.entries(TabellData).map(([key, value], indeks) => (
                            <Table.HeaderCell key={`${indeks}${key}`}>{value}</Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tabellbehandlinger.map((behandling) => (
                        <Table.Row key={behandling.id}>
                            <Table.DataCell>
                                {formaterIsoDatoTid(behandling.opprettet)}
                            </Table.DataCell>
                            <Table.DataCell>{formaterEnumVerdi(behandling.type)}</Table.DataCell>
                            <Table.DataCell>
                                <HStack gap={'2'}>
                                    <Link
                                        to={{
                                            pathname: `${utledUrl(behandling.type)}/${behandling.id}`,
                                        }}
                                    >
                                        {utledBehandlingResultatTilTekst(behandling)}
                                    </Link>
                                    {behandling.resultat == BehandlingResultat.HENLAGT && (
                                        <HenlagtÅrsakOgBegrunnelse behandling={behandling} />
                                    )}
                                    {erKlageOgFeilregistrertAvKA(behandling) && (
                                        <Tooltip content="Klagen er feilregistrert av Nav klageinstans. Gå inn på klagebehandlingens resultatside for å se detaljer">
                                            <AdvarselIkon
                                                title={
                                                    'Behandling feilregistrert av Nav klageinstans'
                                                }
                                            />
                                        </Tooltip>
                                    )}
                                </HStack>
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.resultat === BehandlingResultat.OPPHØRT &&
                                behandling.opphørsdato
                                    ? formaterNullableIsoDato(behandling.opphørsdato)
                                    : behandling.vedtaksperiode?.fom &&
                                        behandling.vedtaksperiode?.tom
                                      ? `${formaterNullableIsoDato(behandling.vedtaksperiode.fom)} - ${formaterNullableIsoDato(behandling.vedtaksperiode.tom)}`
                                      : '-'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterEnumVerdi(behandling.behandlingsårsak)}
                            </Table.DataCell>
                            <Table.DataCell>{formaterEnumVerdi(behandling.status)}</Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDatoTid(behandling.vedtaksdato)}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Tabell>
        </>
    );
};

export default BehandlingTabell;
