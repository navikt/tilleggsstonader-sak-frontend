import React from 'react';

import { Table } from '@navikt/ds-react';

const VedtakshistorikkTabellVisning: React.FC<{
    data: historiskeDataForEnkeltVedtak[];
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
                            <Table.DataCell>{format(new Date(fom))}</Table.DataCell>
                            <Table.DataCell>{format(new Date(tom))}</Table.DataCell>
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

const format = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${d}.${m}.${y}`;
};

export interface historiskeDataForEnkeltVedtak {
    fom: string;
    tom: string;
    aktivitet: string;
    målgruppe: string;
    antallBarn: string;
    utgift: string;
}

export default VedtakshistorikkTabellVisning;
