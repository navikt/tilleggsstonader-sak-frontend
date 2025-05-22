import React from 'react';

import { Table } from '@navikt/ds-react';

import { UtgifterTabell } from './UtgifterTabell';
import { DetaljertVedtaksperiodeBoutgifter } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { faktiskMålgruppeTilTekst } from '../../../Behandling/Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';

export const SamlingRad: React.FC<{
    detaljertBoutgift: DetaljertVedtaksperiodeBoutgifter;
    skalInneholdeAntMndKolonne: boolean;
}> = ({ detaljertBoutgift, skalInneholdeAntMndKolonne }) => {
    return (
        <Table.ExpandableRow
            togglePlacement="right"
            content={
                detaljertBoutgift.utgifterTilOvernatting && (
                    <UtgifterTabell utgifter={detaljertBoutgift.utgifterTilOvernatting} />
                )
            }
        >
            <Table.DataCell>
                {formaterIsoPeriode(detaljertBoutgift.fom, detaljertBoutgift.tom)}
            </Table.DataCell>
            {skalInneholdeAntMndKolonne && <Table.DataCell />}
            <Table.DataCell>{aktivitetTypeTilTekst(detaljertBoutgift.aktivitet)}</Table.DataCell>
            <Table.DataCell>{faktiskMålgruppeTilTekst(detaljertBoutgift.målgruppe)}</Table.DataCell>
            <Table.DataCell>Overnatting</Table.DataCell>
            <Table.DataCell align={'right'}>{detaljertBoutgift.totalUtgiftMåned} kr</Table.DataCell>
            <Table.DataCell align={'right'}>{detaljertBoutgift.stønadsbeløpMnd} kr</Table.DataCell>
        </Table.ExpandableRow>
    );
};
