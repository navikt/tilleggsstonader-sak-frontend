import React from 'react';

import { Table } from '@navikt/ds-react';

import { Vedtaksdetaljer } from './DagligReise/VedtaksDetaljer';
import { BorderTable } from './VedtaksperioderBorderTable';
import styles from './VedtaksperioderOversiktDagligReise.module.css';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../typer/vedtak/vedtakDagligReise';
import { DetaljertVedtaksperiodeDagligReise } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterNullablePeriode } from '../../../utils/dato';
import { typeDagligReiseTilTekst } from '../../Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';

interface Props {
    border?: boolean;
    vedtaksperioder: DetaljertVedtaksperiodeDagligReise[];
}

export const VedtaksperioderOversiktDagligReise: React.FC<Props> = ({
    vedtaksperioder,
    border,
}) => {
    return (
        <BorderTable size={'small'} $border={border}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Perioder</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Type daglig reise</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tiltaksadresse</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Dager pr. uke</Table.HeaderCell>
                    <Table.HeaderCell scope="col" />
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {vedtaksperioder.map((periode, index) => {
                    const beregningsperioder = periode.detaljertBeregningsperioder ?? [];
                    const periodeFom =
                        beregningsperioder[beregningsperioder.length - 1]?.fom ??
                        periode.rammevedtakPrivatBil?.fom;
                    const periodeTom =
                        beregningsperioder[0]?.tom ?? periode.rammevedtakPrivatBil?.tom;
                    const reisedagerPerUke =
                        beregningsperioder[0]?.antallReisedagerPerUke ??
                        hentReisedagerPerUkeFraDelperioder(
                            periode.rammevedtakPrivatBil?.delperioder
                        );
                    const tiltaksadresse =
                        periode.adresse ?? periode.rammevedtakPrivatBil?.aktivitetsadresse ?? '-';
                    const rowKey =
                        periode.rammevedtakPrivatBil?.reiseId ??
                        `${periodeFom}-${periodeTom}-${index}`;

                    return (
                        <Table.ExpandableRow
                            key={rowKey}
                            content={
                                <Vedtaksdetaljer
                                    detaljertBeregningsperioder={beregningsperioder}
                                    rammevedtakPrivatBil={periode.rammevedtakPrivatBil}
                                    className={styles.expandedContent}
                                />
                            }
                            togglePlacement="right"
                        >
                            <Table.DataCell>
                                {formaterNullablePeriode(periodeFom, periodeTom)}
                            </Table.DataCell>

                            <Table.DataCell>
                                {typeDagligReiseTilTekst[periode.typeDagligReise]}
                            </Table.DataCell>
                            <Table.DataCell>{tiltaksadresse}</Table.DataCell>
                            <Table.DataCell>{reisedagerPerUke}</Table.DataCell>
                        </Table.ExpandableRow>
                    );
                })}
            </Table.Body>
        </BorderTable>
    );
};

function hentReisedagerPerUkeFraDelperioder(
    delperioder: RammeForReiseMedPrivatBilDelperiode[] | undefined
): number | string {
    if (delperioder === undefined) {
        return '-';
    }
    if (delperioder.length > 1) {
        return 'Varierende';
    }
    return delperioder[0].reisedagerPerUke;
}
