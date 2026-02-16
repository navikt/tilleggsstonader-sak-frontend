import React from 'react';

import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Table, HStack, Tooltip } from '@navikt/ds-react';

import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { BillettType } from '../../../../typer/behandling/behandlingFakta/faktaReise';
import { formaterIsoDato } from '../../../../utils/dato';

interface Props {
    beregningsDetaljer?: BeregningsresultatForPeriodeDto | null;
}

export const Vedtaksdetaljer: React.FC<Props> = ({ beregningsDetaljer }) => {
    if (!beregningsDetaljer) {
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
                <Table.Row>
                    <TableDataCellSmall>
                        <HStack align="center" gap="2">
                            {beregningsDetaljer.fraTidligereVedtak && (
                                <Tooltip content="Fra tidligere vedtak">
                                    <ClockDashedIcon aria-label="Fra tidligere vedtak" />
                                </Tooltip>
                            )}
                            {formaterIsoDato(beregningsDetaljer.fom)}
                        </HStack>
                    </TableDataCellSmall>
                    <TableDataCellSmall>
                        {formaterIsoDato(beregningsDetaljer.tom)}
                    </TableDataCellSmall>
                    <TableDataCellSmall>{beregningsDetaljer.antallReisedager}</TableDataCellSmall>
                    <TableDataCellSmall>
                        {formatBillett(
                            beregningsDetaljer.billettdetaljer?.[BillettType.TRETTIDAGERSBILLETT],
                            beregningsDetaljer.pris30dagersbillett
                        )}
                    </TableDataCellSmall>
                    <TableDataCellSmall>
                        {formatBillett(
                            beregningsDetaljer.billettdetaljer?.[BillettType.SYVDAGERSBILLETT],
                            beregningsDetaljer.prisSyvdagersbillett
                        )}
                    </TableDataCellSmall>
                    <TableDataCellSmall>
                        {formatBillett(
                            beregningsDetaljer.billettdetaljer?.[BillettType.ENKELTBILLETT],
                            beregningsDetaljer.prisEnkeltbillett
                        )}
                    </TableDataCellSmall>
                    <TableDataCellSmall>{beregningsDetaljer.beløp} kr</TableDataCellSmall>
                </Table.Row>
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
