import React from 'react';

import { Table } from '@navikt/ds-react';

import styles from './YtelserTabell.module.css';
import { PeriodeYtelseRegister } from '../../../typer/registerytelser';
import { formaterIsoDato, formaterNullableIsoDato } from '../../../utils/dato';
import { utledYtelseTekst } from '../../../utils/registerYtelse';

const YtelserTabell: React.FC<{ perioder: PeriodeYtelseRegister[] }> = ({ perioder }) => {
    return (
        <Table size={'small'} zebraStripes={true} className={styles.tabell}>
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
        </Table>
    );
};

export default YtelserTabell;
