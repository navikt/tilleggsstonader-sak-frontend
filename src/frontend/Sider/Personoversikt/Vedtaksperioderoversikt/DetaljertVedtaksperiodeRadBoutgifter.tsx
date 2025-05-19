import React from 'react';

import styled from 'styled-components';

import { Table } from '@navikt/ds-react';
import { ASurfaceSubtle, ABorderDefault, AGray300 } from '@navikt/ds-tokens/dist/tokens';

import { formaterNullableIsoDato } from '../../../utils/dato';
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
