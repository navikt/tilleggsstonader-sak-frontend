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
                {vedtaksperioder.map((periode, tabellIndeks) => {
                    if (periode.utgifterTilOvernatting) {
                        return periode.utgifterTilOvernatting.map((utgift, utgiftIndeks) => (
                            <DetaljertVedtaksperiodeRadBoutgifter
                                key={utgift.fom}
                                fom={utgift.fom}
                                tom={utgift.tom}
                                skalViseAntallMånederKolonne={false}
                                aktivitet={periode.aktivitet}
                                målgruppe={periode.målgruppe}
                                type="Overnatting"
                                totalUtgiftMåned={utgift.utgift}
                                stønadsbeløpMnd={utgift.beløpSomDekkes}
                                skalHaLinjeUnder={
                                    utgiftIndeks === periode.utgifterTilOvernatting!.length - 1
                                }
                                fargetBakgrunn={tabellIndeks % 2 === 0}
                            />
                        ));
                    } else {
                        return (
                            <DetaljertVedtaksperiodeRadBoutgifter
                                key={periode.fom}
                                fom={periode.fom}
                                tom={periode.tom}
                                antallMåneder={periode.antallMåneder}
                                aktivitet={periode.aktivitet}
                                målgruppe={periode.målgruppe}
                                type="Løpende"
                                totalUtgiftMåned={periode.totalUtgiftMåned}
                                stønadsbeløpMnd={periode.stønadsbeløpMnd}
                                fargetBakgrunn={tabellIndeks % 2 === 0}
                            />
                        );
                    }
                })}
            </Table.Body>
        </Table>
    );
};
