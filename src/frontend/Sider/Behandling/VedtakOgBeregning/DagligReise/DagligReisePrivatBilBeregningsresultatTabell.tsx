import React, { FC } from 'react';

import { HStack, Label, Table } from '@navikt/ds-react';

import styles from './DagligReisePrivatBilBeregningTabell.module.css';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import {
    BeregningsresultatForReisePrivatBil,
    RammeForReiseMedPrivatBil,
} from '../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../utils/fomatering';

export const DagligReisePrivatBilBeregningsresultatTabell: FC<{
    reise: BeregningsresultatForReisePrivatBil;
    rammevedtak?: RammeForReiseMedPrivatBil;
}> = ({ reise, rammevedtak }) => {
    return (
        <HStack gap="space-8" className={styles.reiseSection}>
            <Label size="small">
                {reise.adresse} · Privat bil
                {reise.reisedagerPerUke !== undefined && ` · ${reise.reisedagerPerUke} dager/uke`}
            </Label>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <TableHeaderCellSmall>Periode</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Reisedager</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Kilometersats</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Dagsats u/park.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Bompenger per dag</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Ferje per dag</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Parkering for periode</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Stønad</TableHeaderCellSmall>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {reise.perioder.map((periode, index) => (
                        <Table.Row key={`${periode.fom}-${periode.tom}-${index}`}>
                            <TableDataCellSmall>
                                {formaterIsoPeriode(periode.fom, periode.tom)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>{periode.grunnlag.dager.length}</TableDataCellSmall>
                            {rammevedtak?.delperioder.map((delperiode, index) => (
                                <TableDataCellSmall key={index}>
                                    {delperiode.satser.map((it) =>
                                        it
                                            ? `${formaterTallMedTusenSkille(it.kilometersats)} kr`
                                            : '-'
                                    )}
                                </TableDataCellSmall>
                            ))}
                            <TableDataCellSmall>
                                {formaterTallMedTusenSkille(periode.grunnlag.dagsatsUtenParkering)}{' '}
                                kr
                            </TableDataCellSmall>
                            {rammevedtak?.delperioder.map((delperiode, index) => (
                                <div key={index}>
                                    <TableDataCellSmall>
                                        {delperiode.bompengerPerDag
                                            ? `${formaterTallMedTusenSkille(delperiode.bompengerPerDag)} kr`
                                            : '-'}
                                    </TableDataCellSmall>
                                    <TableDataCellSmall>
                                        {delperiode.fergekostnadPerDag
                                            ? `${formaterTallMedTusenSkille(delperiode.fergekostnadPerDag)} kr`
                                            : '-'}
                                    </TableDataCellSmall>
                                </div>
                            ))}
                            <TableDataCellSmall>
                                {formaterTallMedTusenSkille(
                                    periode.grunnlag.dager.reduce(
                                        (sum, dag) => sum + dag.parkeringskostnad,
                                        0
                                    )
                                )}{' '}
                                kr
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {formaterTallMedTusenSkille(periode.stønadsbeløp)} kr
                            </TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
                <tfoot>
                    <Table.Row shadeOnHover={false} className={styles.totalrad}>
                        <Table.DataCell
                            colSpan={7}
                            textSize="small"
                            className={styles.totalradCelle}
                        >
                            Totalt stønadsbeløp
                        </Table.DataCell>
                        <Table.DataCell textSize="small" className={styles.totalradCelle}>
                            {formaterTallMedTusenSkille(
                                //TODO dette burde flyttes til backend. Lager en egen oppgave på det
                                reise.perioder.reduce(
                                    (sum, periode) => sum + periode.stønadsbeløp,
                                    0
                                )
                            )}{' '}
                            kr
                        </Table.DataCell>
                    </Table.Row>
                </tfoot>
            </Table>
        </HStack>
    );
};
