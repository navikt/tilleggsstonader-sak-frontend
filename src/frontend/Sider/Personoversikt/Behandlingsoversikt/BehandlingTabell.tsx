import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, HStack, Table } from '@navikt/ds-react';

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
    const navigate = useNavigate();

    const skalViseHenleggKnapp = (behandling: TabellBehandling) =>
        behandling.type !== BehandlingType.KLAGE &&
        erBehandlingRedigerbar(behandling.status as BehandlingStatus);

    const utledUrl = (type: BehandlingType) =>
        type === BehandlingType.KLAGE ? '/klagebehandling' : '/behandling';

    const [behandlingIdForHenleggelse, settBehandlingIdForHenleggelse] = useState<string>();

    const gåTilBehandling = (behandling: TabellBehandling) => {
        const url = `${utledUrl(behandling.type)}/${behandling.id}`;
        navigate(url);
    };

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
                                {formaterEnumVerdi(behandling.resultat)}
                            </Table.DataCell>
                            <Table.DataCell>
                                <HStack gap="2">
                                    {behandling.status !== BehandlingStatus.FERDIGSTILT ? (
                                        <Button
                                            size="small"
                                            variant="secondary"
                                            onClick={() => gåTilBehandling(behandling)}
                                        >
                                            Gå til behandling
                                        </Button>
                                    ) : (
                                        <Button
                                            size="small"
                                            variant="tertiary"
                                            onClick={() => gåTilBehandling(behandling)}
                                        >
                                            Se behandling
                                        </Button>
                                    )}
                                    {skalViseHenleggKnapp(behandling) && (
                                        <Button
                                            variant="tertiary"
                                            size="small"
                                            onClick={() =>
                                                settBehandlingIdForHenleggelse(behandling.id)
                                            }
                                        >
                                            Henlegg
                                        </Button>
                                    )}
                                </HStack>
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
