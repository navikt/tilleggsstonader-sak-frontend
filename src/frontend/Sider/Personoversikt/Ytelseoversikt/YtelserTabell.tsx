import React from 'react';

import { styled } from 'styled-components';

import { Table } from '@navikt/ds-react';

import { PeriodeYtelseRegister, registerYtelseTilTekst } from '../../../typer/registerytelser';
import { formaterIsoDato } from '../../../utils/dato';

const Tabell = styled(Table)`
    width: 40%;
`;

const YtelserTabell: React.FC<{ perioder: PeriodeYtelseRegister[] }> = ({ perioder }) => {
    return (
        <Tabell size={'small'} zebraStripes={true}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Fom</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tom</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {perioder.map((periode, indeks) => {
                    return (
                        <Table.Row key={indeks}>
                            <Table.DataCell>{registerYtelseTilTekst[periode.type]}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(periode.fom)}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(periode.tom)}</Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Tabell>
    );
};

export default YtelserTabell;
