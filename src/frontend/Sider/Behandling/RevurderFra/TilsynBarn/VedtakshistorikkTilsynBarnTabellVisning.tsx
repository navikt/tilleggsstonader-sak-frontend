import React from 'react';

import { Table } from '@navikt/ds-react';

import { formaterNullableIsoDato } from '../../../../utils/dato';

const VedtakshistorikkTilsynBarnTabellVisning: React.FC<{
    data: Vedtaksperiode[];
}> = ({ data }) => {
    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til.</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Målgruppe</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Ant. barn</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Utgift</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map(({ fom, tom, aktivitet, målgruppe, antallBarn, utgift }) => {
                    return (
                        <Table.Row key={fom}>
                            <Table.DataCell>{formaterNullableIsoDato(fom)}</Table.DataCell>
                            <Table.DataCell>{formaterNullableIsoDato(tom)}</Table.DataCell>
                            <Table.DataCell>{aktivitet}</Table.DataCell>
                            <Table.DataCell>{målgruppe}</Table.DataCell>
                            <Table.DataCell>{antallBarn}</Table.DataCell>
                            <Table.DataCell>{utgift}</Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};

export interface Vedtaksperiode {
    fom: string;
    tom: string;
    aktivitet: string;
    målgruppe: string;
    antallBarn: string;
    utgift: string;
}

export default VedtakshistorikkTilsynBarnTabellVisning;
