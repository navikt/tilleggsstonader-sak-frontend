import React from 'react';

import styled from 'styled-components';

import { Table, VStack } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import { Oppfølging, årsakKontrollTilTekst } from './oppfølgingTyper';
import { formaterIsoDato, formaterIsoPeriode } from '../../../utils/dato';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';
import { målgruppeTypeTilTekst } from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';

const Tabell = styled(Table)`
    border: 1px solid ${ABorderDefault};
`;

export const OppfølgingPerioderTilKontrollTabell = ({ oppfølging }: { oppfølging: Oppfølging }) => {
    return (
        <Tabell size={'small'} style={{ maxWidth: 'fit-content' }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope={'col'}>Periode</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Målgruppe</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Aktivitet</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body style={{ verticalAlign: 'top' }}>
                {oppfølging.data.perioderTilKontroll.map((periode, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>
                            {formaterIsoPeriode(periode.fom, periode.tom)}
                        </Table.DataCell>
                        <Table.DataCell>
                            <VStack>
                                <span>{målgruppeTypeTilTekst(periode.målgruppe)}</span>
                                {periode.endringMålgruppe.map((endring) => (
                                    <span key={endring.årsak}>
                                        {årsakKontrollTilTekst[endring.årsak]}
                                        {endring.fom && ` (${formaterIsoDato(endring.fom)})`}
                                        {endring.tom && ` (${formaterIsoDato(endring.tom)})`}
                                    </span>
                                ))}
                            </VStack>
                        </Table.DataCell>
                        <Table.DataCell>
                            <VStack>
                                {aktivitetTypeTilTekst(periode.aktivitet)}
                                {periode.endringAktivitet.map((endring) => (
                                    <span key={endring.årsak}>
                                        {årsakKontrollTilTekst[endring.årsak]}
                                        {endring.fom && ` (${formaterIsoDato(endring.fom)})`}
                                        {endring.tom && ` (${formaterIsoDato(endring.tom)})`}
                                    </span>
                                ))}
                            </VStack>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Tabell>
    );
};
