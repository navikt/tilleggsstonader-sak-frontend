import React from 'react';

import { Table } from '@navikt/ds-react';

import { Vedtaksdetaljer } from './DagligReise/VedtaksDetaljer';
import { BorderTable } from './VedtaksperioderBorderTable';
import styles from './VedtaksperioderOversiktDagligReise.module.css';
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

                    const fom = beregningsperioder[beregningsperioder.length - 1]?.fom;
                    const tom = beregningsperioder[0]?.tom;

                    return (
                        <Table.ExpandableRow
                            key={index}
                            content={
                                <Vedtaksdetaljer
                                    detaljertBeregningsperioder={beregningsperioder}
                                    className={styles.expandedContent}
                                />
                            }
                            togglePlacement="right"
                        >
                            <Table.DataCell>{formaterNullablePeriode(fom, tom)}</Table.DataCell>

                            <Table.DataCell>
                                {typeDagligReiseTilTekst[periode.typeDagligReise]}
                            </Table.DataCell>
                            <Table.DataCell>{periode.adresse ?? '-'}</Table.DataCell>
                            <Table.DataCell>
                                {[beregningsperioder[0].antallReisedagerPerUke]}
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    );
                })}
            </Table.Body>
        </BorderTable>
    );
};
