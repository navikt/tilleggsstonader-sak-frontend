import React from 'react';

import { Table, HStack } from '@navikt/ds-react';

import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { BillettType } from '../../../../typer/behandling/behandlingFakta/faktaReise';
import { BeregningsresultatForPeriodeDto } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterIsoDato } from '../../../../utils/dato';
import { formaterAntallOgPris } from '../Util';

interface Props {
    beregningsresultat?: BeregningsresultatForPeriodeDto[];
}

export const Vedtaksdetaljer: React.FC<Props> = ({ beregningsresultat }) => {
    if (!beregningsresultat) {
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
                {beregningsresultat.map((periode, idx) => (
                    <Table.Row key={idx}>
                        <TableDataCellSmall>
                            <HStack align="center" gap="2">
                                {formaterIsoDato(periode.fom)}
                            </HStack>
                        </TableDataCellSmall>
                        <TableDataCellSmall>{formaterIsoDato(periode.tom)}</TableDataCellSmall>
                        <TableDataCellSmall>{periode.antallReisedager}</TableDataCellSmall>
                        <TableDataCellSmall>
                            {formaterAntallOgPris(
                                periode.billettdetaljer?.[BillettType.TRETTIDAGERSBILLETT],
                                periode.pris30dagersbillett
                            )}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {formaterAntallOgPris(
                                periode.billettdetaljer?.[BillettType.SYVDAGERSBILLETT],
                                periode.prisSyvdagersbillett
                            )}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {formaterAntallOgPris(
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
