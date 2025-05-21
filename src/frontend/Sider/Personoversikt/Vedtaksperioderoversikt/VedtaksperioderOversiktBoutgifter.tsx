import React from 'react';

import { Table } from '@navikt/ds-react';

import { DetaljertVedtaksperiodeRadBoutgifter } from './DetaljertVedtaksperiodeRadBoutgifter';
import { DetaljertVedtaksperiodeBoutgifter } from '../../../typer/vedtak/vedtaksperiodeOppsummering';

interface Props {
    vedtaksperioder: DetaljertVedtaksperiodeBoutgifter[];
}

export const VedtaksperioderOversiktBoutgifter: React.FC<Props> = ({ vedtaksperioder }) => {
    const inneholderLøpendeUtgifter = vedtaksperioder.some((periode) => periode.erLøpendeUtgift);

    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Beregningsperiode</Table.HeaderCell>
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
                    <Table.HeaderCell scope="col" />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtaksperioder.map((periode) => {
                    return (
                        <DetaljertVedtaksperiodeRadBoutgifter
                            key={periode.fom}
                            detaljertBoutgift={periode}
                        />
                    );
                })}
            </Table.Body>
        </Table>
    );
};
