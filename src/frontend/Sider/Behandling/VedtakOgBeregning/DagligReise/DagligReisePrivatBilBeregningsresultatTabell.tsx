import React, { FC } from 'react';

import { Detail, HelpText, HStack, Label, Table } from '@navikt/ds-react';

import styles from './DagligReisePrivatBilBeregningTabell.module.css';
import { FormatertSats, OppsummertBeregningForReise } from './typer';
import { formaterKilometersatser, formaterDagsatser } from './util';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { kronerMedTusenSkilleEllerStrek } from '../../../../utils/tekstformatering';

export const DagligReisePrivatBilBeregningsresultatTabell: FC<{
    oppsummertBeregning: OppsummertBeregningForReise;
}> = ({ oppsummertBeregning }) => {
    return (
        <HStack gap="space-8" className={styles.reiseSection}>
            <Label size="small">
                {oppsummertBeregning.aktivitetsadresse} · {oppsummertBeregning.reiseavstandEnVei} km
            </Label>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <TableHeaderCellSmall>Uke</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Periode</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Godkjente reisedager</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Kilometersats</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Bompenger per dag</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Fergekostnad per dag</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Dagsats u/park.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Summerte parkeringskostnader</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Stønadsbeløp</TableHeaderCellSmall>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {oppsummertBeregning.perioder.map((periode, index) => (
                        <Table.Row key={`${periode.fom}-${periode.tom}-${index}`}>
                            <TableDataCellSmall>Uke {periode.ukenummer}</TableDataCellSmall>
                            <TableDataCellSmall>
                                {formaterIsoPeriode(periode.fom, periode.tom)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {periode.antallGodkjenteReisedager}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                <SatsInfo satser={formaterKilometersatser(periode.satser)} />
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {kronerMedTusenSkilleEllerStrek(periode.bompengerPerDag)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {kronerMedTusenSkilleEllerStrek(periode.fergekostnadPerDag)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                <SatsInfo satser={formaterDagsatser(periode.satser)} />
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {kronerMedTusenSkilleEllerStrek(periode.totalParkeringskostnad)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {kronerMedTusenSkilleEllerStrek(periode.stønadsbeløp)}
                            </TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
                <tfoot>
                    <Table.Row shadeOnHover={false} className={styles.totalrad}>
                        <Table.DataCell
                            colSpan={8}
                            textSize="small"
                            className={styles.totalradCelle}
                        >
                            Totalt stønadsbeløp
                        </Table.DataCell>
                        <Table.DataCell
                            textSize="small"
                            className={styles.totalradCelle}
                            align="right"
                        >
                            {kronerMedTusenSkilleEllerStrek(oppsummertBeregning.totaltStønadsbeløp)}
                        </Table.DataCell>
                    </Table.Row>
                </tfoot>
            </Table>
        </HStack>
    );
};

const SatsInfo: FC<{
    satser: FormatertSats[];
}> = ({ satser }) => {
    if (satser.length === 1) {
        return satser[0].verdi;
    }

    return (
        <HStack align="center" gap="space-4">
            <i>{satser[0].verdi}</i>
            <HelpText>
                {satser.map((sats, index) => (
                    <Detail key={index}>
                        {sats.verdi} i perioden {formaterIsoPeriode(sats.fom, sats.tom)}
                    </Detail>
                ))}
            </HelpText>
        </HStack>
    );
};
