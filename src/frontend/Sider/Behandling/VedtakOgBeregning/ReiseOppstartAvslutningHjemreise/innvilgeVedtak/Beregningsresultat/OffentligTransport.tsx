import React, { FC } from 'react';

import { Heading, HStack, Table } from '@navikt/ds-react';

import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from '../../../../../../komponenter/TabellSmall';
import { BeregningsresultatOffentligTransport } from '../../../../../../typer/vedtak/vedtakReiseOppstartAvslutningHjemreise';
import { formaterIsoDato } from '../../../../../../utils/dato';

interface Props {
    beregningsresultat: BeregningsresultatOffentligTransport[];
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
                    {beregningsresultat.map((reise) => (
                        <Table.Row key={`${reise.reiseId}-${reise.fom}`}>
                            <TableDataCellSmall>{reise.adresse ?? '-'}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(reise.fom)}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(reise.tom)}</TableDataCellSmall>
                            <TableDataCellSmall align="right">{reise.beløp}</TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
