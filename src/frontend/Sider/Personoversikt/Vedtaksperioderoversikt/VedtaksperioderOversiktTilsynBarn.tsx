import React from 'react';

import { Table } from '@navikt/ds-react';

import { BorderTable } from './VedtaksperioderBorderTable';
import { DetaljertVedtaksperiodeTilsynBarn } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterNullableIsoDato } from '../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../utils/fomatering';
import { faktiskMålgruppeTilTekst } from '../../Behandling/Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';

interface Props {
    border?: boolean;
    vedtaksperioder: DetaljertVedtaksperiodeTilsynBarn[];
}

export const VedtaksperioderOversiktTilsynBarn: React.FC<Props> = ({ vedtaksperioder, border }) => {
    return (
        <BorderTable size={'small'} $border={border}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Målgruppe</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Ant. barn</Table.HeaderCell>
                    <Table.HeaderCell scope="col" align={'right'}>
                        Utgifter
                    </Table.HeaderCell>
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
                            <Table.DataCell>{periode.antallBarn}</Table.DataCell>
                            <Table.DataCell align={'right'}>
                                {formaterTallMedTusenSkille(periode.totalMånedsUtgift)} kr
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </BorderTable>
    );
};
