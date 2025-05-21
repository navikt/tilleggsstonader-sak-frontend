import React from 'react';

import styled from 'styled-components';

import { BodyShort, Label, Table } from '@navikt/ds-react';
import { ASurfaceSubtle } from '@navikt/ds-tokens/dist/tokens';

import { DetaljertVedtaksperiodeBoutgifter } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterIsoPeriode, formaterNullableIsoDato } from '../../../utils/dato';
import { faktiskMålgruppeTilTekst } from '../../Behandling/Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';

const ContentContainer = styled.div`
    padding: 1rem;
    background-color: ${ASurfaceSubtle};
    display: grid;
    grid-template-columns: repeat(4, max-content);
    gap: 0.4rem 2rem;
`;

export const DetaljertVedtaksperiodeRadBoutgifter: React.FC<{
    detaljertBoutgift: DetaljertVedtaksperiodeBoutgifter;
}> = ({ detaljertBoutgift }) => {
    if (detaljertBoutgift.erLøpendeUtgift) {
        return (
            <Table.Row>
                <Table.DataCell>
                    {formaterIsoPeriode(detaljertBoutgift.fom, detaljertBoutgift.tom)}
                </Table.DataCell>
                <Table.DataCell align={'center'}>{detaljertBoutgift.antallMåneder}</Table.DataCell>
                <Table.DataCell>
                    {aktivitetTypeTilTekst(detaljertBoutgift.aktivitet)}
                </Table.DataCell>
                <Table.DataCell>
                    {faktiskMålgruppeTilTekst(detaljertBoutgift.målgruppe)}
                </Table.DataCell>
                <Table.DataCell>{'Løpende'}</Table.DataCell>
                <Table.DataCell align={'right'}>
                    {detaljertBoutgift.totalUtgiftMåned} kr
                </Table.DataCell>
                <Table.DataCell align={'right'}>
                    {detaljertBoutgift.stønadsbeløpMnd} kr
                </Table.DataCell>
            </Table.Row>
        );
    }

    return (
        <Table.ExpandableRow
            togglePlacement="right"
            content={
                <ContentContainer>
                    <Label size={'small'}>Fom</Label>
                    <Label size={'small'}>Tom</Label>
                    <Label size={'small'}>Utgift</Label>
                    <Label size={'small'}>Beløp som dekkes</Label>
                    {detaljertBoutgift.utgifterTilOvernatting &&
                        detaljertBoutgift.utgifterTilOvernatting.map((utgift) => (
                            <React.Fragment key={`${utgift.fom}-${utgift.tom}`}>
                                <BodyShort size={'small'}>
                                    {formaterNullableIsoDato(utgift.fom)}
                                </BodyShort>
                                <BodyShort size={'small'}>
                                    {formaterNullableIsoDato(utgift.tom)}
                                </BodyShort>
                                <BodyShort size={'small'}>{utgift.utgift} kr</BodyShort>
                                <BodyShort size={'small'}>{utgift.beløpSomDekkes} kr</BodyShort>
                            </React.Fragment>
                        ))}
                </ContentContainer>
            }
        >
            <Table.DataCell>
                {formaterIsoPeriode(detaljertBoutgift.fom, detaljertBoutgift.tom)}
            </Table.DataCell>
            <Table.DataCell>{aktivitetTypeTilTekst(detaljertBoutgift.aktivitet)}</Table.DataCell>
            <Table.DataCell>{faktiskMålgruppeTilTekst(detaljertBoutgift.målgruppe)}</Table.DataCell>
            <Table.DataCell>
                {detaljertBoutgift.erLøpendeUtgift ? 'Løpende' : 'Overnatting'}
            </Table.DataCell>
            <Table.DataCell align={'right'}>{detaljertBoutgift.totalUtgiftMåned} kr</Table.DataCell>
            <Table.DataCell align={'right'}>{detaljertBoutgift.stønadsbeløpMnd} kr</Table.DataCell>
        </Table.ExpandableRow>
    );
};
