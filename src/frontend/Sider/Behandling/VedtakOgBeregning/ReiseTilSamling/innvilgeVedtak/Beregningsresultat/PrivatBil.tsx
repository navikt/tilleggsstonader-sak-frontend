import React, { FC } from 'react';

import { Heading, Table } from '@navikt/ds-react';

import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from '../../../../../../komponenter/TabellSmall';
import { BeregningsresultatPrivatBilForSamling } from '../../../../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoDato } from '../../../../../../utils/dato';

interface Props {
    beregningsresultat: BeregningsresultatPrivatBilForSamling[];
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
                        <TableHeaderCellSmall align="right">Stønadsbeløp</TableHeaderCellSmall>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {beregningsresultat.map((samling) => (
                        <Table.Row key={`${samling.reiseId}-${samling.fom}`}>
                            <TableDataCellSmall>{samling.adresse ?? '-'}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(samling.fom)}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(samling.tom)}</TableDataCellSmall>
                            <TableDataCellSmall>{samling.sats}</TableDataCellSmall>
                            <TableDataCellSmall>
                                {samling.totaltReiseavstand !== undefined
                                    ? `${samling.totaltReiseavstand} km`
                                    : '-'}
                            </TableDataCellSmall>
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
