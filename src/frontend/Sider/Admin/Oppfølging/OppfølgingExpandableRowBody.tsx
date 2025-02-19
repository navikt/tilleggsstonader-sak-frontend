import React from 'react';

import { Table, VStack } from '@navikt/ds-react';

import { Oppfølging, årsakKontrollTilTekst } from './oppfølgingTyper';
import { formaterIsoDato, formaterIsoPeriode } from '../../../utils/dato';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';
import { målgruppeTypeTilTekst } from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';

export const OppfølgingExpandableRowBody = ({ oppfølging }: { oppfølging: Oppfølging }) => {
    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope={'col'}>Periode</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Målgruppe</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Aktivitet</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Endring målgruppe</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Endring aktivitet</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {oppfølging.data.perioderTilKontroll.map((periode, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>
                            {formaterIsoPeriode(periode.fom, periode.tom)}
                        </Table.DataCell>
                        <Table.DataCell>{målgruppeTypeTilTekst(periode.målgruppe)}</Table.DataCell>
                        <Table.DataCell>{aktivitetTypeTilTekst(periode.aktivitet)}</Table.DataCell>
                        <Table.DataCell>
                            <VStack>
                                {periode.endringMålgruppe.map((endring) => (
                                    <span key={endring.årsak}>
                                        {årsakKontrollTilTekst[endring.årsak]}{' '}
                                        {endring.fom && formaterIsoDato(endring.fom)}
                                        {endring.tom && formaterIsoDato(endring.tom)}
                                    </span>
                                ))}
                            </VStack>
                        </Table.DataCell>
                        <Table.DataCell>
                            <VStack>
                                {periode.endringAktivitet.map((endring) => (
                                    <span key={endring.årsak}>
                                        {årsakKontrollTilTekst[endring.årsak]}{' '}
                                        {endring.fom && formaterIsoDato(endring.fom)}
                                        {endring.tom && formaterIsoDato(endring.tom)}
                                    </span>
                                ))}
                            </VStack>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
