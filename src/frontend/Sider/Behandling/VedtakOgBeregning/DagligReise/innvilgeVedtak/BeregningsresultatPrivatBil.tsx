import React, { FC } from 'react';

import { Heading, HStack, Label, Table } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import { BeregningsresultatDagligReise } from '../../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../../utils/dato';
import { formatBoolean } from '../../../../../utils/tekstformatering';

interface Props {
    beregningsresultat: BeregningsresultatDagligReise;
}

export const BeregningsresultatPrivatBil: FC<Props> = ({ beregningsresultat }) => {
    return (
        <div>
            <HStack justify="space-between">
                <Heading spacing size="xsmall" level="4">
                    Beregningsresultat
                </Heading>
            </HStack>
            {beregningsresultat.privatBil?.reiser.map((reise, reiseIndex) => {
                return (
                    <div key={reiseIndex} className={styles.reiseSection}>
                        <Label size="small" className={styles.label}>
                            Privat bil {reise.grunnlag.reisedagerPerUke} dager/uke
                        </Label>
                        <Table size="small" className={styles.table}>
                            <Table.Header>
                                <Table.Row>
                                    <TableHeaderCellSmall>F.o.m.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>T.o.m.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>
                                        Maks antall reisedager
                                    </TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Inkluderer helg</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Stønadsbeløp</TableHeaderCellSmall>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {reise.uker.map((uke, ukeIndex) => (
                                    <Table.Row key={`uke-${reiseIndex}-${ukeIndex}`}>
                                        <TableDataCellSmall>
                                            <HStack align="center" gap="2">
                                                {formaterIsoDato(uke.grunnlag.fom)}
                                            </HStack>
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {formaterIsoDato(uke.grunnlag.tom)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {uke.grunnlag.antallDagerDenneUkaSomKanDekkes}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {formatBoolean(uke.grunnlag.antallDagerInkludererHelg)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {uke.stønadsbeløp} kr
                                        </TableDataCellSmall>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                );
            })}
        </div>
    );
};
