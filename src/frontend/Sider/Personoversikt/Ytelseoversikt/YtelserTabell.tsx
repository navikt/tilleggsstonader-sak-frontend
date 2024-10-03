import React from 'react';

import { styled } from 'styled-components';

import { Table } from '@navikt/ds-react';

import {
    ensligForsørgerStønadstypeTekst,
    PeriodeYtelseRegister,
    registerYtelseTilTekstStorForbokstav,
    TypeRegisterYtelse,
} from '../../../typer/registerytelser';
import { formaterIsoDato, formaterNullableIsoDato } from '../../../utils/dato';

const Tabell = styled(Table)`
    width: 40%;
`;

const utledYtelseTekst = (periode: PeriodeYtelseRegister): string => {
    if (periode.type === TypeRegisterYtelse.ENSLIG_FORSØRGER) {
        return periode.ensligForsørgerStønadstype
            ? ensligForsørgerStønadstypeTekst[periode.ensligForsørgerStønadstype]
            : 'Enslig forsørger';
    }
    return `${registerYtelseTilTekstStorForbokstav[periode.type]}${periode.aapErFerdigAvklart ? ' (Ferdig avklart)' : ''}`;
};

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
                            <Table.DataCell>{utledYtelseTekst(periode)}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(periode.fom)}</Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(periode.tom) ?? 'Mangler tom'}
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Tabell>
    );
};

export default YtelserTabell;
