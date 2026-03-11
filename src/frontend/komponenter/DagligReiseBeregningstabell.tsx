import React, { FC } from 'react';

import { ClockDashedIcon } from '@navikt/aksel-icons';
import { HStack, Table, Tooltip } from '@navikt/ds-react';

import styles from './DagligReiseBeregningstabell.module.css';
import { TableDataCellSmall, TableHeaderCellSmall } from './TabellSmall';
import { BillettType } from '../typer/behandling/behandlingFakta/faktaReise';
import { Billettdetaljer } from '../typer/vedtak/vedtakDagligReise';
import { formaterIsoDato } from '../utils/dato';

interface DagligReiseBeregningstabellPeriode {
    fom: string;
    tom: string;
    prisEnkeltbillett?: number | null;
    prisSyvdagersbillett?: number | null;
    pris30dagersbillett?: number | null;
    beløp: number;
    billettdetaljer: Billettdetaljer;
    antallReisedager: number;
    fraTidligereVedtak?: boolean;
}

interface Props {
    perioder: DagligReiseBeregningstabellPeriode[];
    className?: string;
}

export const DagligReiseBeregningstabell: FC<Props> = ({ perioder, className }) => {
    return (
        <Table size="small" className={className}>
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
                {perioder.map((periode, index) => (
                    <Table.Row
                        key={`${periode.fom}-${periode.tom}-${index}`}
                        className={
                            periode.fraTidligereVedtak ? styles.radFraTidligereVedtak : undefined
                        }
                    >
                        <TableDataCellSmall>
                            <HStack align="center" gap="space-8">
                                {periode.fraTidligereVedtak && (
                                    <Tooltip content="Fra tidligere vedtak">
                                        <ClockDashedIcon aria-label="Fra tidligere vedtak" />
                                    </Tooltip>
                                )}
                                {formaterIsoDato(periode.fom)}
                            </HStack>
                        </TableDataCellSmall>
                        <TableDataCellSmall>{formaterIsoDato(periode.tom)}</TableDataCellSmall>
                        <TableDataCellSmall>{periode.antallReisedager}</TableDataCellSmall>
                        <TableDataCellSmall>
                            {formaterAntallOgPris(
                                periode.billettdetaljer[BillettType.TRETTIDAGERSBILLETT],
                                periode.pris30dagersbillett ?? undefined
                            )}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {formaterAntallOgPris(
                                periode.billettdetaljer[BillettType.SYVDAGERSBILLETT],
                                periode.prisSyvdagersbillett ?? undefined
                            )}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {formaterAntallOgPris(
                                periode.billettdetaljer[BillettType.ENKELTBILLETT],
                                periode.prisEnkeltbillett ?? undefined
                            )}
                        </TableDataCellSmall>
                        <TableDataCellSmall>{periode.beløp} kr</TableDataCellSmall>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

function formaterAntallOgPris(antall: number | undefined, pris: number | undefined): string {
    if (!antall) {
        return '-';
    }

    return `${antall} x ${pris} kr`;
}
