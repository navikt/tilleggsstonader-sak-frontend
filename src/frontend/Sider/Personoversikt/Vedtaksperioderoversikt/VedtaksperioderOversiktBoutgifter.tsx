import React from 'react';

import { Table } from '@navikt/ds-react';

import { OversiktKort } from './OversiktKort';
import { typeBoutgiftTilTekst } from '../../../typer/vedtak/vedtakBoutgifter';
import { DetaljertVedtaksperiodeBoutgifter } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterNullableIsoDato } from '../../../utils/dato';
import { faktiskMålgruppeTilTekst } from '../../Behandling/Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';

interface Props {
    vedtaksperioder: DetaljertVedtaksperiodeBoutgifter[];
}

export const VedtaksperioderOversiktBoutgifter: React.FC<Props> = ({ vedtaksperioder }) => {
    return (
        <OversiktKort tittel={'Boutgifter'}>
            <Table size={'small'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Til</Table.HeaderCell>
                        <Table.HeaderCell scope="col" align={'center'}>
                            Ant.mnd
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Målgruppe</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        <Table.HeaderCell scope="col" align={'center'}>
                            Utgift
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col" align={'right'}>
                            Stønad
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {vedtaksperioder.map((periode) => {
                        return (
                            <Table.Row key={periode.fom}>
                                <Table.DataCell>
                                    {formaterNullableIsoDato(periode.fom)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {formaterNullableIsoDato(periode.tom)}
                                </Table.DataCell>
                                <Table.DataCell align={'center'}>
                                    {periode.antallMåneder}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {aktivitetTypeTilTekst(periode.aktivitet)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {faktiskMålgruppeTilTekst(periode.målgruppe)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {typeBoutgiftTilTekst(periode.type)}
                                </Table.DataCell>
                                <Table.DataCell align={'right'}>{periode.utgift} kr</Table.DataCell>
                                <Table.DataCell align={'right'}>{periode.stønad} kr</Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </OversiktKort>
    );
};
