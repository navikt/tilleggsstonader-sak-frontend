import React from 'react';

import { Table } from '@navikt/ds-react';

import { DetaljertVedtaksperiodeBoutgifter } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { faktiskMålgruppeTilTekst } from '../../../Behandling/Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';

export const LøpendeUtgiftRad: React.FC<{
    detaljertBoutgift: DetaljertVedtaksperiodeBoutgifter;
}> = ({ detaljertBoutgift }) => {
    return (
        <Table.Row>
            <Table.DataCell>
                {formaterIsoPeriode(detaljertBoutgift.fom, detaljertBoutgift.tom)}
            </Table.DataCell>
            <Table.DataCell align={'center'}>{detaljertBoutgift.antallMåneder}</Table.DataCell>
            <Table.DataCell>{aktivitetTypeTilTekst(detaljertBoutgift.aktivitet)}</Table.DataCell>
            <Table.DataCell>{faktiskMålgruppeTilTekst(detaljertBoutgift.målgruppe)}</Table.DataCell>
            <Table.DataCell>Løpende</Table.DataCell>
            <Table.DataCell align={'right'}>{detaljertBoutgift.totalUtgiftMåned} kr</Table.DataCell>
            <Table.DataCell align={'right'}>{detaljertBoutgift.stønadsbeløpMnd} kr</Table.DataCell>
        </Table.Row>
    );
};
