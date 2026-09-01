import React, { FC } from 'react';

import { Heading, Table } from '@navikt/ds-react';

import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from '../../../../../../komponenter/TabellSmall';
import { BeregningsresultatPrivatBil } from '../../../../../../typer/vedtak/vedtakReiseOppstartAvslutningHjemreise';
import { formaterIsoDato } from '../../../../../../utils/dato';

interface Props {
    beregningsresultat: BeregningsresultatPrivatBil[];
}

export const BeregningPrivatBil: FC<Props> = ({ beregningsresultat }) => {
    return (
        <div>
            <Heading spacing size="xsmall" level="4">
                Beregningsresultat for privat bil
            </Heading>

            <Table>
                <Table.Header>
                    <Table.Row>
                        <TableHeaderCellSmall>Adresse</TableHeaderCellSmall>
                        <TableHeaderCellSmall>F.o.m.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>T.o.m.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Sats</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Totalt reiseavstand</TableHeaderCellSmall>
                        <TableHeaderCellSmall align="right">Bompenger</TableHeaderCellSmall>
                        <TableHeaderCellSmall align="right">Fergekostnad</TableHeaderCellSmall>
                        <TableHeaderCellSmall align="right">Stønadsbeløp</TableHeaderCellSmall>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {beregningsresultat.map((reise) => (
                        <Table.Row key={`${reise.reiseId}-${reise.fom}`}>
                            <TableDataCellSmall>{reise.adresse ?? '-'}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(reise.fom)}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(reise.tom)}</TableDataCellSmall>
                            <TableDataCellSmall>{reise.sats}</TableDataCellSmall>
                            <TableDataCellSmall>{reise.totaltReiseavstand} km</TableDataCellSmall>
                            <TableDataCellSmall align="right">
                                {reise.bompenger ?? '-'}
                            </TableDataCellSmall>
                            <TableDataCellSmall align="right">
                                {reise.fergekostnad ?? '-'}
                            </TableDataCellSmall>
                            <TableDataCellSmall align="right">{reise.beløp}</TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
