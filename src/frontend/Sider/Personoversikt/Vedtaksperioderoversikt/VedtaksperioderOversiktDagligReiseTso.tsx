import React from 'react';

import { Table } from '@navikt/ds-react';

import { Vedtaksdetaljer } from './DagligReise/Vedtaksdetaljer';
import { BorderTable } from './VedtaksperioderBorderTable';
import { stønadstypeTilEnhet } from '../../../typer/behandling/behandlingTema';
import { DetaljertVedtaksperiodeDagligReiseTso } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterNullableIsoDato } from '../../../utils/dato';
import { faktiskMålgruppeTilTekst } from '../../Behandling/Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';
import { typeDagligReiseTilTekst } from '../../Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';

interface Props {
    border?: boolean;
    vedtaksperioder: DetaljertVedtaksperiodeDagligReiseTso[];
}
export const VedtaksperioderOversiktDagligReiseTso: React.FC<Props> = ({
    border,
    vedtaksperioder,
}) => {
    return (
        <BorderTable size={'small'} $border={border}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Målgruppe</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Type daglig reise</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Enhet</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtaksperioder.map((periode) => {
                    return (
                        <Table.ExpandableRow
                            key={periode.fom}
                            content={
                                <Vedtaksdetaljer
                                    beregningsDetaljer={periode.beregningsDetaljer ?? []}
                                />
                            }
                            togglePlacement={'right'}
                        >
                            <Table.DataCell>{formaterNullableIsoDato(periode.fom)}</Table.DataCell>
                            <Table.DataCell>{formaterNullableIsoDato(periode.tom)}</Table.DataCell>
                            <Table.DataCell>
                                {aktivitetTypeTilTekst(periode.aktivitet)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {faktiskMålgruppeTilTekst(periode.målgruppe)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {typeDagligReiseTilTekst[periode.typeDagligReise]}
                            </Table.DataCell>
                            <Table.DataCell>
                                {stønadstypeTilEnhet[periode.stønadstype]}
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    );
                })}
            </Table.Body>
        </BorderTable>
    );
};
