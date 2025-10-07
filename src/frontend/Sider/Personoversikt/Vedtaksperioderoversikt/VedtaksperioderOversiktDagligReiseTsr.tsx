import React from 'react';

import { Table } from '@navikt/ds-react';

import { BorderTable } from './VedtaksperioderBorderTable';
import { DetaljertVedtaksperiodeDagligReiseTsr } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterNullableIsoDato } from '../../../utils/dato';
import { faktiskMålgruppeTilTekst } from '../../Behandling/Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';

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
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Målgruppe</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtaksperioder.map((periode) => {
                    return (
                        <Table.Row key={periode.fom}>
                            <Table.DataCell>{formaterNullableIsoDato(periode.fom)}</Table.DataCell>
                            <Table.DataCell>{formaterNullableIsoDato(periode.tom)}</Table.DataCell>
                            <Table.DataCell>
                                {aktivitetTypeTilTekst(periode.aktivitet)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {faktiskMålgruppeTilTekst(periode.målgruppe)}
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </BorderTable>
    );
};
