import React, { FC } from 'react';

import { Detail, HelpText, HStack, Label, Table } from '@navikt/ds-react';

import styles from './DagligReisePrivatBilBeregningTabell.module.css';
import { OppsummertBeregningForReise } from './typer';
import { formaterKilometersatser } from './util';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { RammeForReiseMedPrivatBilSatsForDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';
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
                        <TableHeaderCellSmall>Dager kjørt</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Kilometersats</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Bompenger tot.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Fergekostnad tot.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Parkering tot.</TableHeaderCellSmall>
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
                                <KilometersatsInfo satser={periode.satser} />
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {kronerMedTusenSkilleEllerStrek(periode.bompengerTotalt)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {kronerMedTusenSkilleEllerStrek(periode.fergekostnadTotalt)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {kronerMedTusenSkilleEllerStrek(periode.parkeringskostnadTotalt)}
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

const KilometersatsInfo: FC<{
    satser: RammeForReiseMedPrivatBilSatsForDelperiode[];
}> = ({ satser }) => {
    const formaterteSatser = formaterKilometersatser(satser);

    if (formaterteSatser.length === 1) {
        return formaterteSatser[0].verdi;
    }

    return (
        <HStack align="center" gap="space-4" wrap={false}>
            <i>{formaterteSatser[0].verdi}</i>
            <HelpText>
                {formaterteSatser.map((sats, index) => (
                    <Detail key={index}>
                        {sats.verdi} i perioden {formaterIsoPeriode(sats.fom, sats.tom)}
                    </Detail>
                ))}
            </HelpText>
        </HStack>
    );
};
