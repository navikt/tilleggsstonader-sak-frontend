import React, { useState } from 'react';

import styled from 'styled-components';

import { Table } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { mappeIdTilMappenavn } from './utils';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { formaterNullableIsoDato } from '../../../utils/dato';
import Oppgaveknapp from '../../Oppgavebenk/Oppgaveknapp';
import { utledTypeBehandling } from '../../Oppgavebenk/oppgaveutils';
import { Mappe, Oppgave } from '../../Oppgavebenk/typer/oppgave';
import { oppgaveTypeTilVisningstekstSomTarHensynTilKlage } from '../../Oppgavebenk/typer/oppgavetema';

const Tabell = styled(Table)`
    max-width: 900px;
    border: 1px solid ${ABorderDivider};
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const Oppgaveliste: React.FC<{
    oppgaver: Oppgave[];
    mapper: Record<number, Mappe>;
    oppdaterOppgaveEtterOppdatering: (oppgave: Oppgave) => void;
}> = ({ oppgaver, mapper, oppdaterOppgaveEtterOppdatering }) => {
    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);

    return (
        <FlexColumn>
            <Tabell size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Oppgavetype</Table.ColumnHeader>
                        <Table.ColumnHeader>Stønad</Table.ColumnHeader>
                        <Table.ColumnHeader>Opprettet</Table.ColumnHeader>
                        <Table.ColumnHeader>Mappe</Table.ColumnHeader>
                        <Table.ColumnHeader>Frist</Table.ColumnHeader>
                        <Table.ColumnHeader>Tildelt</Table.ColumnHeader>
                        <Table.ColumnHeader />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {oppgaver.map((oppgave) => (
                        <Table.Row key={oppgave.id}>
                            <Table.DataCell>
                                {oppgave.oppgavetype &&
                                    oppgaveTypeTilVisningstekstSomTarHensynTilKlage(
                                        oppgave.oppgavetype
                                    )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {utledTypeBehandling(
                                    oppgave.behandlingstype,
                                    oppgave.behandlingstema
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(oppgave.opprettetTidspunkt)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {mappeIdTilMappenavn(oppgave.mappeId, mapper)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(oppgave.fristFerdigstillelse)}
                            </Table.DataCell>
                            <Table.DataCell>{oppgave.tilordnetRessurs}</Table.DataCell>
                            <Table.DataCell>
                                <Oppgaveknapp
                                    oppgave={oppgave}
                                    oppdaterOppgaveEtterOppdatering={
                                        oppdaterOppgaveEtterOppdatering
                                    }
                                    laster={laster}
                                    settLaster={settLaster}
                                    settFeilmelding={settFeilmelding}
                                />
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Tabell>
            <Feilmelding variant="alert">{feilmelding}</Feilmelding>
        </FlexColumn>
    );
};

export default Oppgaveliste;
