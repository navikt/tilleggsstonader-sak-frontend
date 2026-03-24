import React, { FC } from 'react';

import { Heading, Table } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import {
    TableHeaderCellSmall,
    TableDataCellSmall,
} from '../../../../../../komponenter/TabellSmall';
import { RammevedtakPrivatBil } from '../../../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../../../utils/dato';

interface Props {
    rammevedtak: RammevedtakPrivatBil;
}

export const BeregningsresultatRammevedtakPrivatBil: FC<Props> = ({ rammevedtak }) => {
    return (
        <div>
            <Heading spacing size="xsmall" level="4">
                Rammevedtak for reise med privat bil
            </Heading>
            <Table size="small" className={styles.table}>
                <Table.Header>
                    <Table.Row>
                        <TableHeaderCellSmall>Adresse</TableHeaderCellSmall>
                        <TableHeaderCellSmall>F.o.m.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>T.o.m.</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Reisedager</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Avstand</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Bom</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Ferge</TableHeaderCellSmall>
                        <TableHeaderCellSmall>Dagsats</TableHeaderCellSmall>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rammevedtak.reiser.map((reise) => (
                        <Table.Row key={reise.reiseId}>
                            <TableDataCellSmall>{reise.aktivitetsadresse}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(reise.fom)}</TableDataCellSmall>
                            <TableDataCellSmall>{formaterIsoDato(reise.tom)}</TableDataCellSmall>
                            <TableDataCellSmall>{reise.reisedagerPerUke}</TableDataCellSmall>
                            <TableDataCellSmall>{reise.reiseavstandEnVei} km</TableDataCellSmall>
                            <TableDataCellSmall>
                                {reise.bompengerPerDag ? `${reise.bompengerPerDag} kr` : '-'}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {reise.fergekostnadPerDag ? `${reise.fergekostnadPerDag} kr` : '-'}
                            </TableDataCellSmall>
                            <TableDataCellSmall>{reise.dagsatsUtenParkering} kr</TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
