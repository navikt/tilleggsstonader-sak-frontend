import React, { useCallback } from 'react';

import { Link } from 'react-router-dom';

import { Button, Table } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { Behandling } from '../../../typer/behandling/behandling';
import { BehandlingResultat } from '../../../typer/behandling/behandlingResultat';
import {
    BehandlingStatus,
    erBehandlingRedigerbar,
} from '../../../typer/behandling/behandlingStatus';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { BehandlingÅrsak } from '../../../typer/behandling/behandlingÅrsak';
import { PartialRecord } from '../../../typer/common';
import {
    KlageBehandling,
    KlagebehandlingResultat,
    KlagebehandlingStatus,
    KlageÅrsak,
} from '../../../typer/klage';
import { formaterIsoDatoTid, formaterNullableIsoDatoTid } from '../../../utils/dato';
import { formaterEnumVerdi } from '../../../utils/tekstformatering';
import { sorterBehandlinger } from '../../../utils/behandlingutil';

const TabellData: PartialRecord<keyof Behandling | 'vedtaksdato', string> = {
    opprettet: 'Behandling opprettetdato',
    type: 'Type',
    behandlingsårsak: 'Årsak',
    status: 'Status',
    vedtaksdato: 'Vedtaksdato',
    resultat: 'Resultat',
};

interface TabellBehandling {
    id: string;
    opprettet: string;
    type: BehandlingType | string;
    behandlingsårsak: BehandlingÅrsak | KlageÅrsak | undefined;
    status: BehandlingStatus | KlagebehandlingStatus;
    vedtaksdato?: string | undefined;
    resultat: BehandlingResultat | KlagebehandlingResultat | undefined;
}

interface Props {
    behandlinger: Behandling[];
    klagebehandlinger: KlageBehandling[];
}

const BehandlingTabell: React.FC<Props> = ({ behandlinger, klagebehandlinger }) => {
    const { request } = useApp();

    const henleggBehandling = useCallback(
        (behandlingId: string) => {
            request<string, { årsak: string }>(
                `/api/sak/behandling/${behandlingId}/henlegg`,
                'POST',
                { årsak: 'FEILREGISTRERT' }
            );
        },
        [request]
    );

    const skalViseHenleggKnapp = (behandling: TabellBehandling) =>
        behandling.type !== BehandlingType.KLAGE &&
        erBehandlingRedigerbar(behandling.status as BehandlingStatus);

    const tabellBehandlinger: TabellBehandling[] = behandlinger.map((behandling) => {
        return {
            id: behandling.id,
            opprettet: behandling.opprettet,
            type: behandling.type,
            behandlingsårsak: behandling.behandlingsårsak,
            status: behandling.status,
            vedtaksdato: behandling.vedtaksdato,
            resultat: behandling.resultat,
        };
    });

    const tabellKlagebehandlinger: TabellBehandling[] = klagebehandlinger.map((behandling) => {
        return {
            id: behandling.id,
            opprettet: behandling.opprettet,
            type: BehandlingType.KLAGE,
            behandlingsårsak: behandling.årsak,
            status: behandling.status,
            vedtaksdato: behandling.vedtaksdato,
            resultat: behandling.resultat,
        };
    });

    const alleBehandlinger = tabellBehandlinger
        .concat(tabellKlagebehandlinger)
        .sort(sorterBehandlinger);

    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    {Object.entries(TabellData).map(([key, value], indeks) => (
                        <Table.HeaderCell key={`${indeks}${key}`}>{value}</Table.HeaderCell>
                    ))}
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {alleBehandlinger.map((behandling) => (
                    <Table.Row key={behandling.id}>
                        <Table.DataCell>{formaterIsoDatoTid(behandling.opprettet)}</Table.DataCell>
                        <Table.DataCell>{formaterEnumVerdi(behandling.type)}</Table.DataCell>
                        <Table.DataCell>
                            {formaterEnumVerdi(behandling.behandlingsårsak)}
                        </Table.DataCell>
                        <Table.DataCell>{formaterEnumVerdi(behandling.status)}</Table.DataCell>
                        <Table.DataCell>
                            {formaterNullableIsoDatoTid(behandling.vedtaksdato)}
                        </Table.DataCell>

                        <Table.DataCell>
                            <Link to={{ pathname: `/behandling/${behandling.id}` }}>
                                {formaterEnumVerdi(behandling.resultat)}
                            </Link>
                        </Table.DataCell>
                        <Table.DataCell>
                            {skalViseHenleggKnapp(behandling) && (
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => henleggBehandling(behandling.id)}
                                >
                                    Henlegg
                                </Button>
                            )}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default BehandlingTabell;
