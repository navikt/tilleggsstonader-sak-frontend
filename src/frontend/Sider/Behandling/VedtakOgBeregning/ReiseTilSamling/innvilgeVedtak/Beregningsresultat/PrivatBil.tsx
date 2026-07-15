import React, { FC } from 'react';

import { Heading, HStack, Table } from '@navikt/ds-react';

import { BeregningsresultatPrivatBilForSamling } from '../../../../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoDato } from '../../../../../../utils/dato';

interface Props {
    beregningsresultat: BeregningsresultatPrivatBilForSamling[];
}

export const BeregningPrivatBil: FC<Props> = ({ beregningsresultat }) => {
    return (
        <div>
            <HStack justify="space-between">
                <Heading spacing size="xsmall" level="4">
                    Beregningsresultat for privat bil
                </Heading>
            </HStack>

            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Adresse</Table.HeaderCell>
                        <Table.HeaderCell>F.o.m.</Table.HeaderCell>
                        <Table.HeaderCell>T.o.m.</Table.HeaderCell>
                        <Table.HeaderCell>Sats</Table.HeaderCell>
                        <Table.HeaderCell>Totalt reiseavstand</Table.HeaderCell>
                        <Table.HeaderCell align="right">Stønadsbeløp</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {beregningsresultat.map((samling) => (
                        <Table.Row key={`${samling.reiseId}-${samling.fom}`}>
                            <Table.DataCell>{samling.adresse ?? '-'}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(samling.fom)}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(samling.tom)}</Table.DataCell>
                            <Table.DataCell>{samling.sats}</Table.DataCell>
                            <Table.DataCell>
                                {samling.totaltReiseAvstand !== undefined
                                    ? `${samling.totaltReiseAvstand} km`
                                    : '-'}
                            </Table.DataCell>
                            <Table.DataCell align="right">{samling.beløp ?? 0}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
