import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Table, Tooltip } from '@navikt/ds-react';

import HenleggModal from './HenleggModal';
import { useApp } from '../../../context/AppContext';
import { Behandling } from '../../../typer/behandling/behandling';
import {
    BehandlingStatus,
    erBehandlingRedigerbar,
} from '../../../typer/behandling/behandlingStatus';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { PartialRecord } from '../../../typer/common';
import {
    erKlageOgFeilregistrertAvKA,
    TabellBehandling,
    utledBehandlingResultatTilTekst,
} from '../../../utils/behandlingutil';
import { formaterIsoDatoTid, formaterNullableIsoDatoTid } from '../../../utils/dato';
import { formaterEnumVerdi } from '../../../utils/tekstformatering';

const AdvarselIkon = styled(ExclamationmarkTriangleIcon)`
    margin-left: 1rem;
`;

const TabellData: PartialRecord<keyof Behandling | 'vedtaksdato', string> = {
    opprettet: 'Opprettet',
    type: 'Type',
    behandlingsårsak: 'Årsak',
    status: 'Status',
    vedtaksdato: 'Vedtaksdato',
    resultat: 'Resultat',
};

interface Props {
    tabellbehandlinger: TabellBehandling[];
    hentBehandlinger: () => void;
}

const BehandlingTabell: React.FC<Props> = ({ tabellbehandlinger, hentBehandlinger }) => {
    const { erSaksbehandler } = useApp();
    const skalViseHenleggKnapp = (behandling: TabellBehandling) =>
        erSaksbehandler &&
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
                                    {utledBehandlingResultatTilTekst(behandling)}
                                </Link>
                                {erKlageOgFeilregistrertAvKA(behandling) && (
                                    <Tooltip content="Klagen er feilregistrert av NAV klageinstans. Gå inn på klagebehandlingens resultatside for å se detaljer">
                                        <AdvarselIkon
                                            title={'Behandling feilregistrert av NAV klageinstans'}
                                        />
                                    </Tooltip>
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
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
