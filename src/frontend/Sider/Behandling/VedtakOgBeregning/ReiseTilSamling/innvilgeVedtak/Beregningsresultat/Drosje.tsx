import React, { FC } from 'react';

import { Heading, HStack, Table } from '@navikt/ds-react';

import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from '../../../../../../komponenter/TabellSmall';
import { BeregningsresultatDrosje } from '../../../../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoDato } from '../../../../../../utils/dato';

interface Props {
    beregningsresultat: BeregningsresultatDrosje[];
    visTidligerePerioder?: boolean;
}

export const BeregningDrosje: FC<Props> = ({
    beregningsresultat,
    visTidligerePerioder = false,
}) => {
    const relevanteSamlinger = beregningsresultat.filter(
        (samling) => visTidligerePerioder || !samling.fraTidligereVedtak
    );

    if (relevanteSamlinger.length === 0) return null;

    return (
        <div>
            <HStack justify="space-between">
                <Heading spacing size="xsmall" level="4">
                    Beregningsresultat for drosje
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
                    {relevanteSamlinger.map((samling) => (
                        <Table.Row key={`${samling.reiseId}-${samling.fom}`}>
                            <TableDataCellSmall>{samling.adresse ?? '-'}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(samling.fom)}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(samling.tom)}</TableDataCellSmall>
                            <TableDataCellSmall align="right">{samling.beløp}</TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
