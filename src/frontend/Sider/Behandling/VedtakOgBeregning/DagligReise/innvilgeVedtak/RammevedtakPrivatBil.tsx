import React, { FC } from 'react';

import { InformationSquareIcon } from '@navikt/aksel-icons';
import { HStack, InfoCard, Label, Table } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import { BeregningsresultatPrivatBil } from '../../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../../utils/dato';
import { formatBoolean } from '../../../../../utils/tekstformatering';

interface Props {
    beregningsresultat: BeregningsresultatPrivatBil;
}

export const RammevedtakPrivatBil: FC<Props> = ({ beregningsresultat }) => {
    if (!beregningsresultat.reiser) {
        return (
            // todo - lage en bedre feilmelding
            <InfoCard data-color="info">
                <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
                    <InfoCard.Title>Fikk ikke hentet ut rammevedtaket</InfoCard.Title>
                </InfoCard.Header>
            </InfoCard>
        );
    }

    return beregningsresultat.reiser.map((reise, reiseIndex) => (
        <div key={reiseIndex} className={styles.reiseSection}>
            <Label size="small" className={styles.label}>
                Privat bil {reise.grunnlag.reisedagerPerUke} dager/uke
            </Label>
            <Table size="small" className={styles.table}>
                <Table.Header>
                    <Table.Row>
                        <TableHeaderCellSmall>F.o.m.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>T.o.m.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Maks antall reisedager</TableHeaderCellSmall>
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
                            <TableDataCellSmall>{uke.stønadsbeløp} kr</TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    ));
};
