import React from 'react';

import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Table, HStack, Tooltip } from '@navikt/ds-react';

import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { BillettType } from '../../../../typer/behandling/behandlingFakta/faktaReise';
import { formaterIsoDato } from '../../../../utils/dato';

interface Props {
    beregningsDetaljer?: BeregningsresultatForPeriodeDto[] | null;
}

export const Vedtaksdetaljer: React.FC<Props> = ({ beregningsDetaljer }) => {
    if (!beregningsDetaljer?.length) {
        return <>Ingen beregningsdetaljer</>;
    }
    return (
        <Table size="small">
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
                {beregningsDetaljer.map((periode, idx) => (
                    <Table.Row key={idx}>
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
                        <TableDataCellSmall>{formaterIsoDato(periode.tom)}</TableDataCellSmall>
                        <TableDataCellSmall>{periode.antallReisedager}</TableDataCellSmall>
                        <TableDataCellSmall>
                            {formatBillett(
                                periode.billettdetaljer?.[BillettType.TRETTIDAGERSBILLETT],
                                periode.pris30dagersbillett
                            )}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {formatBillett(
                                periode.billettdetaljer?.[BillettType.SYVDAGERSBILLETT],
                                periode.prisSyvdagersbillett
                            )}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {formatBillett(
                                periode.billettdetaljer?.[BillettType.ENKELTBILLETT],
                                periode.prisEnkeltbillett
                            )}
                        </TableDataCellSmall>
                        <TableDataCellSmall>{periode.beløp} kr</TableDataCellSmall>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

function formatBillett(antall?: number, pris?: number) {
    if (!antall) return '-';
    return `${antall} x ${pris} kr`;
}
export interface BeregningsresultatForPeriodeDto {
    fom: string;
    tom: string;
    prisEnkeltbillett?: number;
    prisSyvdagersbillett?: number;
    pris30dagersbillett?: number;
    antallReisedagerPerUke?: number;
    antallReisedager?: number;
    beløp: number;
    billettdetaljer?: Partial<Record<BillettType, number>>;
    fraTidligereVedtak: boolean;
    brukersNavKontor?: string | null;
}
