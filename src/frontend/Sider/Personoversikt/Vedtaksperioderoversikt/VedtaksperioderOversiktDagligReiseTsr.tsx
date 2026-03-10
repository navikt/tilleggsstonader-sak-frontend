import React from 'react';

import { Table } from '@navikt/ds-react';

import { Vedtaksdetaljer } from './DagligReise/VedtaksDetaljer';
import { BorderTable } from './VedtaksperioderBorderTable';
import { DetaljertVedtaksperiodeDagligReiseTsr } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterNullablePeriode } from '../../../utils/dato';
import { typeDagligReiseTilTekst } from '../../Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';

interface Props {
    border?: boolean;
    vedtaksperioder: DetaljertVedtaksperiodeDagligReiseTsr[];
}

export const VedtaksperioderOversiktDagligReiseTsr: React.FC<Props> = ({
    vedtaksperioder,
    border,
}) => {
    return (
        <BorderTable size={'small'} $border={border}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Perioder</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Type daglig reise</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Dager pr. uke</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {vedtaksperioder.map((periode) => {
                    const beregningsperioder = periode.detaljertBeregningsperioder ?? [];

                    const fom = beregningsperioder[0]?.fom;
                    const tom = beregningsperioder[beregningsperioder.length - 1]?.tom;

                    return (
                        <Table.ExpandableRow
                            key={`${fom}-${periode.stønadstype}`}
                            content={
                                <Vedtaksdetaljer detaljertBeregningsperioder={beregningsperioder} />
                            }
                            togglePlacement="right"
                        >
                            <Table.DataCell>{formaterNullablePeriode(fom, tom)}</Table.DataCell>

                            <Table.DataCell>
                                {typeDagligReiseTilTekst[periode.typeDagligReise]}
                            </Table.DataCell>
                            <Table.DataCell>
                                {[periode.detaljertBeregningsperioder[0].antallReisedagerPerUke]}
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    );
                })}
            </Table.Body>
        </BorderTable>
    );
};
