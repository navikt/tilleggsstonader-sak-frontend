import React from 'react';

import styled from 'styled-components';

import { BodyShort, Label, Table } from '@navikt/ds-react';
import { ASurfaceSubtle, ABorderDefault, AGray300, AGray50 } from '@navikt/ds-tokens/dist/tokens';

import { DetaljertVedtaksperiodeBoutgifter } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterIsoPeriode, formaterNullableIsoDato } from '../../../utils/dato';
import {
    FaktiskMålgruppe,
    faktiskMålgruppeTilTekst,
} from '../../Behandling/Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';
import { AktivitetType } from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';

const TabellRad = styled(Table.Row)<{ skalHaLinjeUnder: boolean; fargetBakrunn: boolean }>`
    background-color: ${({ fargetBakrunn }) => (fargetBakrunn ? 'white' : ASurfaceSubtle)};
    
    .navds-table__data-cell {
        border-bottom: ${({ skalHaLinjeUnder }) =>
            `1px solid ${skalHaLinjeUnder ? ABorderDefault : AGray300}`};
    
`;

export const DetaljertVedtaksperiodeRadBoutgifter: React.FC<{
    fom: string;
    tom: string;
    skalViseAntallMånederKolonne?: boolean;
    antallMåneder?: number;
    aktivitet: AktivitetType;
    målgruppe: FaktiskMålgruppe;
    type: string;
    totalUtgiftMåned: number;
    stønadsbeløpMnd: number;
    fargetBakgrunn: boolean;
    skalHaLinjeUnder?: boolean;
}> = ({
    fom,
    tom,
    skalViseAntallMånederKolonne = true,
    antallMåneder,
    aktivitet,
    målgruppe,
    type,
    totalUtgiftMåned,
    stønadsbeløpMnd,
    fargetBakgrunn: fargetBagrunn,
    skalHaLinjeUnder = true,
}) => {
    return (
        <TabellRad skalHaLinjeUnder={skalHaLinjeUnder} fargetBakrunn={fargetBagrunn}>
            <Table.DataCell>{formaterNullableIsoDato(fom)}</Table.DataCell>
            <Table.DataCell>{formaterNullableIsoDato(tom)}</Table.DataCell>
            {skalViseAntallMånederKolonne && (
                <Table.DataCell align={'center'}>{antallMåneder}</Table.DataCell>
            )}
            <Table.DataCell>{aktivitetTypeTilTekst(aktivitet)}</Table.DataCell>
            <Table.DataCell>{faktiskMålgruppeTilTekst(målgruppe)}</Table.DataCell>
            <Table.DataCell>{type}</Table.DataCell>
            <Table.DataCell align={'right'}>{totalUtgiftMåned} kr</Table.DataCell>
            <Table.DataCell align={'right'}>{stønadsbeløpMnd} kr</Table.DataCell>
        </TabellRad>
    );
};

const TableRow = styled(Table.Row)`
    border-bottom: hidden;
`;

const TableRowGray = styled(Table.Row).withConfig({
    shouldForwardProp: (prop) => prop !== 'borderbottom',
})<{ borderbottom: boolean }>`
    background-color: ${AGray50};
    border-bottom: ${(props) => (props.borderbottom ? 'initial' : 'hidden')};
`;

export const DetaljertVedtaksperiodeRadBoutgifter2: React.FC<{
    detaljertBoutgift: DetaljertVedtaksperiodeBoutgifter;
}> = ({ detaljertBoutgift }) => {
    return (
        <>
            <TableRow>
                <Table.DataCell>
                    {formaterIsoPeriode(detaljertBoutgift.fom, detaljertBoutgift.tom)}
                </Table.DataCell>
                <Table.DataCell />
                {/* {skalViseAntallMånederKolonne && (
                    <Table.DataCell align={'center'}>{detaljertBoutgift. antallMåneder}</Table.DataCell>
                )} */}
                <Table.DataCell />
                <Table.DataCell />
                <Table.DataCell />
                {/* <Table.DataCell>
                    {aktivitetTypeTilTekst(detaljertBoutgift.aktivitet)}
                </Table.DataCell>
                <Table.DataCell>
                    {faktiskMålgruppeTilTekst(detaljertBoutgift.målgruppe)}
                </Table.DataCell>
                <Table.DataCell>
                    {detaljertBoutgift.erLøpendeUtgift ? 'Løpende' : 'Overnatting'}
                </Table.DataCell> */}
                {/* <Table.DataCell align={'right'}>
                    {detaljertBoutgift.totalUtgiftMåned} kr
                </Table.DataCell>
                <Table.DataCell align={'right'}>
                    {detaljertBoutgift.stønadsbeløpMnd} kr
                </Table.DataCell> */}
            </TableRow>
            {detaljertBoutgift.utgifterTilOvernatting &&
                detaljertBoutgift.utgifterTilOvernatting.map((utgift, index) => (
                    <TableRowGray
                        key={index}
                        borderbottom={
                            index === detaljertBoutgift.utgifterTilOvernatting!.length - 1
                        }
                    >
                        <Table.DataCell />
                        <Table.DataCell>
                            {formaterIsoPeriode(utgift.fom, utgift.tom)}
                        </Table.DataCell>

                        {/* <Table.DataCell align={'center'}>{utgift.antallMåneder}</Table.DataCell> */}
                        <Table.DataCell>
                            {aktivitetTypeTilTekst(detaljertBoutgift.aktivitet)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {faktiskMålgruppeTilTekst(detaljertBoutgift.målgruppe)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {detaljertBoutgift.erLøpendeUtgift ? 'Løpende' : 'Overnatting'}
                        </Table.DataCell>
                        {/* <Table.DataCell />
                        <Table.DataCell />
                        <Table.DataCell /> */}
                        <Table.DataCell align={'right'}>{utgift.utgift} kr</Table.DataCell>
                        <Table.DataCell align={'right'}>{utgift.beløpSomDekkes} kr</Table.DataCell>
                    </TableRowGray>
                ))}
        </>
    );
};

const ContentContainer = styled.div`
    padding: 1rem;
    background-color: ${ASurfaceSubtle};
    display: grid;
    grid-template-columns: repeat(4, max-content);
    gap: 0.4rem 2rem;
    width: fit-content;
`;

export const DetaljertVedtaksperiodeRadBoutgifter3: React.FC<{
    detaljertBoutgift: DetaljertVedtaksperiodeBoutgifter;
}> = ({ detaljertBoutgift }) => {
    return (
        <>
            <Table.ExpandableRow
                togglePlacement="right"
                content={
                    <ContentContainer>
                        <Label size={'small'}>Fom</Label>
                        <Label size={'small'}>Tom</Label>
                        <Label size={'small'}>Utgift</Label>
                        <Label size={'small'}>Beløp som dekkes</Label>
                        {detaljertBoutgift.utgifterTilOvernatting &&
                            detaljertBoutgift.utgifterTilOvernatting.map((utgift, index) => (
                                // eslint-disable-next-line react/jsx-key
                                <>
                                    <BodyShort size={'small'} key={index}>
                                        {formaterNullableIsoDato(utgift.fom)}
                                    </BodyShort>
                                    <BodyShort size={'small'} key={index}>
                                        {formaterNullableIsoDato(utgift.tom)}
                                    </BodyShort>
                                    <BodyShort size={'small'}>{utgift.utgift} kr</BodyShort>
                                    <BodyShort size={'small'}>{utgift.beløpSomDekkes} kr</BodyShort>
                                </>
                            ))}
                    </ContentContainer>
                }
            >
                <Table.DataCell>
                    {formaterIsoPeriode(detaljertBoutgift.fom, detaljertBoutgift.tom)}
                </Table.DataCell>
                {/* {skalViseAntallMånederKolonne && (
                    <Table.DataCell align={'center'}>{detaljertBoutgift. antallMåneder}</Table.DataCell>
                )} */}
                <Table.DataCell>
                    {aktivitetTypeTilTekst(detaljertBoutgift.aktivitet)}
                </Table.DataCell>
                <Table.DataCell>
                    {faktiskMålgruppeTilTekst(detaljertBoutgift.målgruppe)}
                </Table.DataCell>
                <Table.DataCell>
                    {detaljertBoutgift.erLøpendeUtgift ? 'Løpende' : 'Overnatting'}
                </Table.DataCell>
                <Table.DataCell align={'right'}>
                    {detaljertBoutgift.totalUtgiftMåned} kr
                </Table.DataCell>
                <Table.DataCell align={'right'}>
                    {detaljertBoutgift.stønadsbeløpMnd} kr
                </Table.DataCell>
            </Table.ExpandableRow>
        </>
    );
};
