import React from 'react';

import styled from 'styled-components';

import { Alert, Table, VStack } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import { Oppfølging, årsakKontrollTilTekst } from './oppfølgingTyper';
import { formaterIsoDato, formaterIsoPeriode } from '../../../utils/dato';
import {
    AktivitetType,
    AktivitetTypeTilTekst,
} from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    MålgruppeType,
    MålgruppeTypeTilTekst,
} from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';

const Tabell = styled(Table)`
    border: 1px solid ${ABorderDefault};
`;

const typerTilTekst: Record<MålgruppeType | AktivitetType, string> = {
    ...MålgruppeTypeTilTekst,
    ...AktivitetTypeTilTekst,
};

export const OppfølgingPerioderTilKontrollTabell = ({ oppfølging }: { oppfølging: Oppfølging }) => {
    return (
        <Tabell size={'small'} style={{ width: '50rem' }}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope={'col'} style={{ width: '24%' }}>
                        Periode
                    </Table.HeaderCell>
                    <Table.HeaderCell scope={'col'} style={{ width: '24%' }}>
                        Type
                    </Table.HeaderCell>
                    <Table.HeaderCell scope={'col'} style={{ width: '52%' }}>
                        Årsak
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body style={{ verticalAlign: 'top' }}>
                {oppfølging.perioderTilKontroll.map((periode, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>
                            {formaterIsoPeriode(periode.fom, periode.tom)}
                        </Table.DataCell>
                        <Table.DataCell>
                            <VStack>
                                <span>{typerTilTekst[periode.type]}</span>
                                {periode.type === MålgruppeType.OMSTILLINGSSTØNAD && (
                                    <Alert variant={'warning'} inline>
                                        Kan gjelde gammelt regelverk
                                    </Alert>
                                )}
                            </VStack>
                        </Table.DataCell>
                        <Table.DataCell>
                            <VStack>
                                {periode.endringer.map((endring) => (
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
