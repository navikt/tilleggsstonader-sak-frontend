import React, { FC } from 'react';

import { Heading, HStack, Table } from '@navikt/ds-react';

import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from '../../../../../../komponenter/TabellSmall';
import { BeregningsresultatOffentligTransportForSamling } from '../../../../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoDato } from '../../../../../../utils/dato';

interface Props {
    beregningsresultat: BeregningsresultatOffentligTransportForSamling[];
}

export const BeregningOffentligTransport: FC<Props> = ({ beregningsresultat }) => {
    return (
        <div>
            <HStack justify="space-between">
                <Heading spacing size="xsmall" level="4">
                    Beregningsresultat for offentlig transport
                </Heading>
            </HStack>

            <Table>
                <Table.Header>
                    <Table.Row>
                        <TableHeaderCellSmall>Adresse</TableHeaderCellSmall>
                        <TableHeaderCellSmall>F.o.m.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>T.o.m.</TableHeaderCellSmall>
                        <TableHeaderCellSmall align="right">Stønadsbeløp</TableHeaderCellSmall>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {beregningsresultat.map((samling) => (
                        <Table.Row key={`${samling.reiseId}-${samling.fom}`}>
                            <TableDataCellSmall>{samling.adresse ?? '-'}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(samling.fom)}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(samling.tom)}</TableDataCellSmall>
                            <TableDataCellSmall align="right">
                                {samling.beløp ?? 0}
                            </TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
