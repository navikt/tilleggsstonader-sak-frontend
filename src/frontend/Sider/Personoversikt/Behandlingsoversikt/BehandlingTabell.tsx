import React from 'react';

import { Link } from 'react-router-dom';

import { Table } from '@navikt/ds-react';

import { Behandling } from '../../../typer/behandling/behandling';
import { PartialRecord } from '../../../typer/common';
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

const BehandlingTabell: React.FC<{
    behandlinger: Behandling[];
}> = ({ behandlinger }) => {
    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    {Object.entries(TabellData).map(([key, value], indeks) => (
                        <Table.HeaderCell key={`${indeks}${key}`}>{value}</Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
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
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default BehandlingTabell;
