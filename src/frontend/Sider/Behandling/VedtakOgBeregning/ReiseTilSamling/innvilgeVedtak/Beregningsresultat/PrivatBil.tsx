import React, { FC } from 'react';

import { Heading, Table } from '@navikt/ds-react';

import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from '../../../../../../komponenter/TabellSmall';
import { BeregningsresultatPrivatBil } from '../../../../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoDato } from '../../../../../../utils/dato';
import { kronerMedTusenSkilleEllerStrek } from '../../../../../../utils/tekstformatering';

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
                        <TableHeaderCellSmall>Bompenger</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Fergekostnad</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Parkering</TableHeaderCellSmall>
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
                            <TableDataCellSmall>{samling.totaltReiseavstand} km</TableDataCellSmall>
                            <TableDataCellSmall>
                                {kronerMedTusenSkilleEllerStrek(samling.bompenger)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {kronerMedTusenSkilleEllerStrek(samling.fergekostnad)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {kronerMedTusenSkilleEllerStrek(samling.parkering)}
                            </TableDataCellSmall>
                            <TableDataCellSmall align="right">
                                {kronerMedTusenSkilleEllerStrek(samling.beløp)}
                            </TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
