import React from 'react';

import { Table } from '@navikt/ds-react';

import { BorderTable } from './VedtaksperioderBorderTable';
import { DetaljertVedtaksperiodeReiseTilSamling } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterIsoPeriode } from '../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../utils/fomatering';

interface Props {
    border?: boolean;
    vedtaksperioder: DetaljertVedtaksperiodeReiseTilSamling[];
}

export const VedtaksperioderOversiktReiseTilSamling: React.FC<Props> = ({
    border,
    vedtaksperioder,
}) => {
    return (
        <BorderTable size={'small'} $border={border}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtaksperioder.map((periode, index) => (
                    <Table.Row key={`${periode.fom}-${periode.tom}-${index}`}>
                        <Table.DataCell>
                            {formaterIsoPeriode(periode.fom, periode.tom)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTallMedTusenSkille(periode.beløp)} kr
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </BorderTable>
    );
};
