import React, { FC, useState } from 'react';

import { Heading, HStack, Label, Switch, Table } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import { BillettType } from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { BeregningsresultatDagligReise } from '../../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../../utils/dato';

interface Props {
    beregningsresultat: BeregningsresultatDagligReise;
}

export const Beregningsresultat: FC<Props> = ({ beregningsresultat }) => {
    const [visTidligereVedtak, setVisTidligereVedtak] = useState(false);

    return (
        <div>
            <HStack justify="space-between">
                <Heading spacing size="xsmall" level="4">
                    Beregningsresultat
                </Heading>
                <Switch
                    position="left"
                    size="small"
                    checked={visTidligereVedtak}
                    onChange={() => setVisTidligereVedtak((prev) => !prev)}
                >
                    Vis tidligere perioder
                </Switch>
            </HStack>
            {beregningsresultat.offentligTransport?.reiser.map((reise, reiseIndex) => {
                const relevantePerioder = reise.perioder.filter(
                    (periode) => visTidligereVedtak || !periode.fraTidligereVedtak
                );
                if (relevantePerioder.length === 0) {
                    return null;
                }
                const antallReisedagerPerUke = relevantePerioder[0].antallReisedagerPerUke;
                return (
                    <div key={reiseIndex} className={styles.reiseSection}>
                        <Label size="small" className={styles.label}>
                            Offentlig transport {antallReisedagerPerUke} dager/uke
                        </Label>
                        <Table size="small" className={styles.table}>
                            <Table.Header>
                                <Table.Row>
                                    <TableHeaderCellSmall>F.o.m.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>T.o.m.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Reisedager</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>30-dagersb.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>7-dagersb.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Enkeltb.</TableHeaderCellSmall>
                                    <TableHeaderCellSmall>Stønadsbeløp</TableHeaderCellSmall>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {relevantePerioder.map((periode, periodeIndex) => (
                                    <Table.Row key={`periode-${reiseIndex}-${periodeIndex}`}>
                                        <TableDataCellSmall>
                                            {formaterIsoDato(periode.fom)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {formaterIsoDato(periode.tom)}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {periode.antallReisedager}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {formaterAntallOgPris(
                                                periode.billettdetaljer[
                                                    BillettType.TRETTIDAGERSBILLETT
                                                ],
                                                periode.pris30dagersbillett
                                            )}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {formaterAntallOgPris(
                                                periode.billettdetaljer[
                                                    BillettType.SYVDAGERSBILLETT
                                                ],
                                                periode.prisSyvdagersbillett
                                            )}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>
                                            {formaterAntallOgPris(
                                                periode.billettdetaljer[BillettType.ENKELTBILLETT],
                                                periode.prisEnkeltbillett
                                            )}
                                        </TableDataCellSmall>
                                        <TableDataCellSmall>{periode.beløp} kr</TableDataCellSmall>
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

function formaterAntallOgPris(antall: number | undefined, pris: number | undefined): string {
    if (!antall) {
        return '-';
    }
    return `${antall} x ${pris} kr`;
}
