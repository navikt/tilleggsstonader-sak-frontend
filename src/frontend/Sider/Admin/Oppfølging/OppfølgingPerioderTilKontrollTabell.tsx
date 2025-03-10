import React from 'react';

import styled from 'styled-components';

import { Alert, Table, VStack } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import { Oppfølging, årsakKontrollTilTekst } from './oppfølgingTyper';
import { formaterIsoDato, formaterIsoPeriode } from '../../../utils/dato';
import { aktivitetTypeTilTekst } from '../../Behandling/Inngangsvilkår/Aktivitet/utilsAktivitet';
import {
    MålgruppeType,
    målgruppeTypeTilTekst,
} from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';

const Tabell = styled(Table)`
    border: 1px solid ${ABorderDefault};
`;

export const OppfølgingPerioderTilKontrollTabell = ({ oppfølging }: { oppfølging: Oppfølging }) => {
    return (
        <Tabell size={'small'} style={{ width: '50rem' }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope={'col'} style={{ width: '24%' }}>
                        Periode
                    </Table.HeaderCell>
                    <Table.HeaderCell scope={'col'} style={{ width: '38%' }}>
                        Målgruppe
                    </Table.HeaderCell>
                    <Table.HeaderCell scope={'col'} style={{ width: '38%' }}>
                        Aktivitet
                    </Table.HeaderCell>
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
                                <VStack>
                                    <span>{målgruppeTypeTilTekst(periode.målgruppe)}</span>
                                    {periode.målgruppe === MålgruppeType.OMSTILLINGSSTØNAD && (
                                        <Alert variant={'warning'} inline>
                                            Kan gjelde gammelt regelverk
                                        </Alert>
                                    )}
                                </VStack>
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
