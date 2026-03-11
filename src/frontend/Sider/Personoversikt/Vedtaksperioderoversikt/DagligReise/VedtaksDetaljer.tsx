import React from 'react';

import { Table, HStack } from '@navikt/ds-react';

import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { BillettType } from '../../../../typer/behandling/behandlingFakta/faktaReise';
import { DetaljertBeregningsperioder } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterIsoDato } from '../../../../utils/dato';
import { formaterAntallOgPris } from '../../../../utils/fomatering';

interface Props {
    detaljertBeregningsperioder?: DetaljertBeregningsperioder[];
}

export const Vedtaksdetaljer: React.FC<Props> = ({ detaljertBeregningsperioder }) => {
    if (!detaljertBeregningsperioder) {
        return <>Ingen beregningsdetaljer</>;
    }
    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <TableHeaderCellSmall>Fom</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Tom</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Reisedager</TableHeaderCellSmall>
                    <TableHeaderCellSmall>30-dagers.</TableHeaderCellSmall>
                    <TableHeaderCellSmall>7-dagers.</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Enkeltbill.</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Stønadsbeløp</TableHeaderCellSmall>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {detaljertBeregningsperioder.map((periode) => {
                    const billettdetaljer = periode.billettdetaljer ?? {};

                    return (
                        <Table.Row key={`${periode.fom}-${periode.tom}`}>
                            <TableDataCellSmall>
                                <HStack align="center" gap="space-8">
                                    {formaterIsoDato(periode.fom)}
                                </HStack>
                            </TableDataCellSmall>

                            <TableDataCellSmall>{formaterIsoDato(periode.tom)}</TableDataCellSmall>

                            <TableDataCellSmall>{periode.antallReisedager}</TableDataCellSmall>

                            <TableDataCellSmall>
                                {formaterAntallOgPris(
                                    billettdetaljer[BillettType.TRETTIDAGERSBILLETT],
                                    periode.pris30dagersbillett ?? undefined
                                )}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {formaterAntallOgPris(
                                    billettdetaljer[BillettType.SYVDAGERSBILLETT],
                                    periode.prisSyvdagersbillett ?? undefined
                                )}
                            </TableDataCellSmall>

                            <TableDataCellSmall>
                                {formaterAntallOgPris(
                                    billettdetaljer[BillettType.ENKELTBILLETT],
                                    periode.prisEnkeltbillett ?? undefined
                                )}
                            </TableDataCellSmall>

                            <TableDataCellSmall>{periode.beløp} kr</TableDataCellSmall>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};
