import React, { FC } from 'react';

import { Alert, Table } from '@navikt/ds-react';

import styles from './BeregningsresultatMedUtgift.module.css';
import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { formaterIsoDato } from '../../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../../utils/fomatering';

interface Props {
    beregningsresultat: BeregningsresultatBoutgifter;
}

const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => (
    <div className={styles.container}>
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope={'col'}>Beregningsperiode</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Utgiftsperiode</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Merutgift</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Stønadsbeløp</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'} />
                </Table.Row>
                {beregningsresultat.perioder.map((periode) => (
                    <React.Fragment key={periode.fom + periode.tom}>
                        <Table.Row className={styles.tableRow}>
                            <Table.DataCell>{`${formaterIsoDato(periode.fom)} - ${formaterIsoDato(periode.tom)}`}</Table.DataCell>
                            <Table.DataCell />
                            <Table.DataCell>
                                {formaterTallMedTusenSkille(periode.sumUtgifter)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterTallMedTusenSkille(periode.stønadsbeløp)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {periode.delAvTidligereUtbetaling && (
                                    <Alert variant="info" size={'small'} inline>
                                        Treffer allerede utbetalt periode
                                    </Alert>
                                )}
                            </Table.DataCell>
                        </Table.Row>
                        {periode.utgifter.map((utgift, index, utgifter) => (
                            <Table.Row
                                key={utgift.fom + utgift.tom}
                                className={styles.tableRowGray}
                                style={{
                                    borderBottom:
                                        index === utgifter.length - 1 ? 'initial' : 'hidden',
                                }}
                            >
                                <Table.DataCell />
                                <Table.DataCell>{`${formaterIsoDato(utgift.fom)} - ${formaterIsoDato(utgift.tom)}`}</Table.DataCell>
                                <Table.DataCell>
                                    {formaterTallMedTusenSkille(utgift.utgift)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {formaterTallMedTusenSkille(utgift.tilUtbetaling)}
                                </Table.DataCell>
                                <Table.DataCell />
                            </Table.Row>
                        ))}
                    </React.Fragment>
                ))}
            </Table.Header>
        </Table>
    </div>
);

export default Beregningsresultat;
