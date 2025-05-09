import React from 'react';

import { Table } from '@navikt/ds-react';

import { OversiktKort } from './OversiktKort';
import { DetaljertVedtaksperiodeLæremidler } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterNullableIsoDato } from '../../../utils/dato';
import { faktiskMålgruppeTilTekst } from '../../Behandling/Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';
import { studienivåTilTekst } from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';

interface Props {
    vedtaksperioder: DetaljertVedtaksperiodeLæremidler[];
}

export const VedtaksperioderOversiktLæremidler: React.FC<Props> = ({ vedtaksperioder }) => {
    return (
        <OversiktKort tittel={'Læremidler'}>
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
                        <Table.HeaderCell scope="col">Nivå</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Prosent</Table.HeaderCell>
                        <Table.HeaderCell scope="col" align={'right'}>
                            Månedsbeløp
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
                                    {studienivåTilTekst[periode.studienivå]}
                                </Table.DataCell>
                                <Table.DataCell align={'right'}>
                                    {periode.studieprosent}%
                                </Table.DataCell>
                                <Table.DataCell align={'right'}>
                                    {periode.månedsbeløp} kr
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </OversiktKort>
    );
};
