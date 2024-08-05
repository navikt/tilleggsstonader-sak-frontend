import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Button, Table } from '@navikt/ds-react';

import HenleggModal from './HenleggModal';
import { Behandling } from '../../../typer/behandling/behandling';
import { BehandlingResultat } from '../../../typer/behandling/behandlingResultat';
import {
    BehandlingStatus,
    erBehandlingRedigerbar,
} from '../../../typer/behandling/behandlingStatus';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { BehandlingÅrsak } from '../../../typer/behandling/behandlingÅrsak';
import { PartialRecord } from '../../../typer/common';
import { KlagebehandlingResultat, KlagebehandlingStatus, KlageÅrsak } from '../../../typer/klage';
import { formaterIsoDatoTid, formaterNullableIsoDatoTid } from '../../../utils/dato';
import { formaterEnumVerdi } from '../../../utils/tekstformatering';

const TabellData: PartialRecord<keyof Behandling | 'vedtaksdato', string> = {
    opprettet: 'Behandling opprettetdato',
    type: 'Type',
    behandlingsårsak: 'Årsak',
    status: 'Status',
    vedtaksdato: 'Vedtaksdato',
    resultat: 'Resultat',
};

export interface TabellBehandling {
    id: string;
    opprettet: string;
    type: BehandlingType;
    behandlingsårsak: BehandlingÅrsak | KlageÅrsak | undefined;
    status: BehandlingStatus | KlagebehandlingStatus;
    vedtaksdato?: string | undefined;
    resultat: BehandlingResultat | KlagebehandlingResultat | undefined;
}

interface Props {
    tabellbehandlinger: TabellBehandling[];
    hentBehandlinger: () => void;
}

const BehandlingTabell: React.FC<Props> = ({ tabellbehandlinger, hentBehandlinger }) => {
    const skalViseHenleggKnapp = (behandling: TabellBehandling) =>
        behandling.type !== BehandlingType.KLAGE &&
        erBehandlingRedigerbar(behandling.status as BehandlingStatus);

    const utledUrl = (type: BehandlingType) =>
        type === BehandlingType.KLAGE ? '/klagebehandling' : '/behandling';

    const [behandlingIdForHenleggelse, settBehandlingIdForHenleggelse] = useState<string>();

    return (
        <>
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
                    {tabellbehandlinger.map((behandling) => (
                        <Table.Row key={behandling.id}>
                            <Table.DataCell>
                                {formaterIsoDatoTid(behandling.opprettet)}
                            </Table.DataCell>
                            <Table.DataCell>{formaterEnumVerdi(behandling.type)}</Table.DataCell>
                            <Table.DataCell>
                                {formaterEnumVerdi(behandling.behandlingsårsak)}
                            </Table.DataCell>
                            <Table.DataCell>{formaterEnumVerdi(behandling.status)}</Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDatoTid(behandling.vedtaksdato)}
                            </Table.DataCell>

                            <Table.DataCell>
                                <Link
                                    to={{
                                        pathname: `${utledUrl(behandling.type)}/${behandling.id}`,
                                    }}
                                >
                                    {formaterEnumVerdi(behandling.resultat)}
                                </Link>
                            </Table.DataCell>
                            <Table.DataCell>
                                {skalViseHenleggKnapp(behandling) && (
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={() =>
                                            settBehandlingIdForHenleggelse(behandling.id)
                                        }
                                    >
                                        Henlegg
                                    </Button>
                                )}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {behandlingIdForHenleggelse && (
                <HenleggModal
                    behandlingId={behandlingIdForHenleggelse}
                    settBehandlingId={settBehandlingIdForHenleggelse}
                    hentBehandlinger={hentBehandlinger}
                />
            )}
        </>
    );
};

export default BehandlingTabell;
