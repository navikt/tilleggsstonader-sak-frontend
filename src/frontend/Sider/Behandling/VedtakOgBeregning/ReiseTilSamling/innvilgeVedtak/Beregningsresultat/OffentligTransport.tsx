import React, { FC } from 'react';

import { Heading, HStack, Table } from '@navikt/ds-react';

import { BeregningsResultatForSamling } from '../../../../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoDato } from '../../../../../../utils/dato';

interface Props {
    beregningsresultat: BeregningsResultatForSamling[];
}

export const BeregningOffentligTransport: FC<Props> = ({ beregningsresultat }) => {
    return (
        <div>
            <HStack justify="space-between">
                <Heading spacing size="xsmall" level="4">
                    Beregningsresultat
                </Heading>
            </HStack>

            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Adresse</Table.HeaderCell>
                        <Table.HeaderCell>F.o.m.</Table.HeaderCell>
                        <Table.HeaderCell>T.o.m.</Table.HeaderCell>
                        <Table.HeaderCell align="right">Stønadsbeløp</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {beregningsresultat.map((samling) => (
                        <Table.Row key={`${samling.reiseId}-${samling.fom}`}>
                            <Table.DataCell>{samling.adresse ?? '-'}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(samling.fom)}</Table.DataCell>
                            <Table.DataCell>{formaterIsoDato(samling.tom)}</Table.DataCell>
                            <Table.DataCell align="right">
                                {samling.utgifterOffentligTransport ?? 0}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
