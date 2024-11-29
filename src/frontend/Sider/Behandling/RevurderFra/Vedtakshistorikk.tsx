import React from 'react';

import { Heading, Table } from '@navikt/ds-react';

export const Vedtakshistorikk = () => {
    return (
        <>
            <Heading size="xsmall">Vedtakshistorikk tilsyn barn TS-Sak </Heading>
            <Table>
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
        </>
    );
};

const format = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${d}.${m}.${y}`;
};

const data = [
    {
        fom: '2021-04-28T19:12:14.358Z',
        tom: '2021-06-28T19:12:14.358Z',
        aktivitet: 'Arbeidstrening',
        målgruppe: 'AAP',
        antallBarn: '2',
        utgift: '6000',
    },
];
