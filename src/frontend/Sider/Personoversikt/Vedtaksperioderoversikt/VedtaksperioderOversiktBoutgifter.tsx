import React from 'react';

import styled from 'styled-components';

import { Table } from '@navikt/ds-react';
import { ABorderDefault, ASurfaceSubtle } from '@navikt/ds-tokens/dist/tokens';

import { OversiktKort } from './OversiktKort';
import { DetaljertVedtaksperiodeBoutgifter } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterNullableIsoDato } from '../../../utils/dato';
import {
    FaktiskMålgruppe,
    faktiskMålgruppeTilTekst,
} from '../../Behandling/Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';
import { AktivitetType } from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';

interface Props {
    vedtaksperioder: DetaljertVedtaksperiodeBoutgifter[];
}

export const VedtaksperioderOversiktBoutgifter: React.FC<Props> = ({ vedtaksperioder }) => {
    const inneholderLøpendeUtgifter = vedtaksperioder.some((periode) => periode.erLøpendeUtgift);

    return (
        <OversiktKort tittel={'Boutgifter'}>
            <Table size={'small'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Til</Table.HeaderCell>
                        {inneholderLøpendeUtgifter && (
                            <Table.HeaderCell scope="col" align="center">
                                Ant.mnd
                            </Table.HeaderCell>
                        )}
                        <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Målgruppe</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        <Table.HeaderCell scope="col" align={'right'}>
                            Utgift
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col" align={'right'}>
                            Stønad
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {vedtaksperioder.map((periode, indeks) => {
                        if (periode.utgifterTilOvernatting) {
                            return (
                                <Samlinger
                                    key={periode.fom}
                                    periode={periode}
                                    tabellInneholderLøpende={inneholderLøpendeUtgifter}
                                    indeksITabell={indeks}
                                />
                            );
                        } else {
                            return (
                                <PeriodeRad
                                    key={periode.fom}
                                    fom={periode.fom}
                                    tom={periode.tom}
                                    antallMåneder={periode.antallMåneder}
                                    aktivitet={periode.aktivitet}
                                    målgruppe={periode.målgruppe}
                                    type="Løpende"
                                    totalUtgiftMåned={periode.totalUtgiftMåned}
                                    stønadsbeløpMnd={periode.stønadsbeløpMnd}
                                    indeksITabell={indeks}
                                />
                            );
                        }
                    })}
                </Table.Body>
            </Table>
        </OversiktKort>
    );
};

const Test = styled(Table.Row)<{ skalHaLinjeUnder: boolean; fargetBakrunn: boolean }>`
    background-color: ${({ fargetBakrunn }) => (fargetBakrunn ? ASurfaceSubtle : 'white')};
    .navds-table__data-cell {
        border-bottom: ${({ skalHaLinjeUnder }) =>
            skalHaLinjeUnder ? `1px solid ${ABorderDefault}` : 'none'};
    }
`;

const Samlinger: React.FC<{
    periode: DetaljertVedtaksperiodeBoutgifter;
    tabellInneholderLøpende: boolean;
    indeksITabell: number;
}> = ({ periode, tabellInneholderLøpende, indeksITabell }) => {
    if (!periode.utgifterTilOvernatting) return;

    return periode.utgifterTilOvernatting.map((utgift, indeks) => (
        <Test
            key={utgift.fom}
            skalHaLinjeUnder={indeks === periode.utgifterTilOvernatting!.length - 1}
            fargetBakrunn={indeksITabell % 2 === 0}
        >
            <Table.DataCell>{formaterNullableIsoDato(utgift.fom)}</Table.DataCell>
            <Table.DataCell>{formaterNullableIsoDato(utgift.tom)}</Table.DataCell>
            {tabellInneholderLøpende && <Table.DataCell />}
            <Table.DataCell>{aktivitetTypeTilTekst(periode.aktivitet)}</Table.DataCell>
            <Table.DataCell>{faktiskMålgruppeTilTekst(periode.målgruppe)}</Table.DataCell>
            <Table.DataCell>Overnatting</Table.DataCell>
            <Table.DataCell align={'right'}>{utgift.utgift} kr</Table.DataCell>
            <Table.DataCell align={'right'}>{utgift.beløpSomDekkes} kr</Table.DataCell>
        </Test>
    ));
};

const PeriodeRad: React.FC<{
    fom: string;
    tom: string;
    skalViseAntallMånederKolonne?: boolean;
    antallMåneder?: number;
    aktivitet: AktivitetType;
    målgruppe: FaktiskMålgruppe;
    type: string;
    totalUtgiftMåned: number;
    stønadsbeløpMnd: number;
    indeksITabell: number;
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
    indeksITabell,
}) => {
    return (
        <Test skalHaLinjeUnder={true} fargetBakrunn={indeksITabell % 2 === 0}>
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
        </Test>
    );
};
