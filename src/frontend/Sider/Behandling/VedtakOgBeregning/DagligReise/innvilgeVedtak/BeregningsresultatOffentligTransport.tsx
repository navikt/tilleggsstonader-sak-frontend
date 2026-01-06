import React, { FC, useState } from 'react';

import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Heading, HStack, Label, Switch, Table, Tooltip } from '@navikt/ds-react';

import styles from './Beregningsresultat.module.css';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../../komponenter/TabellSmall';
import { BillettType } from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { BeregningsresultatDagligReise } from '../../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../../../../../utils/dato';

interface Props {
    beregningsresultat: BeregningsresultatDagligReise;
}

export const BeregningsresultatOffentligTransport: FC<Props> = ({ beregningsresultat }) => {
    const [visTidligerePerioder, setVisTidligerePerioder] = useState(false);

    const harPerioderFraTidligereVedtak = beregningsresultat.offentligTransport?.reiser.some(
        (reise) => reise.perioder.some((periode) => periode.fraTidligereVedtak)
    );

    return (
        <div>
            <HStack justify="space-between">
                <Heading spacing size="xsmall" level="4">
                    Beregningsresultat
                </Heading>
                {harPerioderFraTidligereVedtak && (
                    <Switch
                        position="left"
                        size="small"
                        checked={visTidligerePerioder}
                        onChange={() => setVisTidligerePerioder((prev) => !prev)}
                    >
                        Vis upåvirkede perioder
                    </Switch>
                )}
            </HStack>
            {beregningsresultat.offentligTransport?.reiser.map((reise, reiseIndex) => {
                const relevantePerioder = reise.perioder.filter(
                    (periode) => visTidligerePerioder || !periode.fraTidligereVedtak
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
                                    <Table.Row
                                        key={`periode-${reiseIndex}-${periodeIndex}`}
                                        className={
                                            periode.fraTidligereVedtak
                                                ? styles.radFraTidligereVedtak
                                                : undefined
                                        }
                                    >
                                        <TableDataCellSmall>
                                            <HStack align="center" gap="2">
                                                {periode.fraTidligereVedtak && (
                                                    <Tooltip content="Fra tidligere vedtak">
                                                        <ClockDashedIcon aria-label="Fra tidligere vedtak" />
                                                    </Tooltip>
                                                )}
                                                {formaterIsoDato(periode.fom)}
                                            </HStack>
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
