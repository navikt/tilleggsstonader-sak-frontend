import React, { useState } from 'react';

import { Popover, Table } from '@navikt/ds-react';

import Oppgaveknapp from './Oppgaveknapp';
import { utledetFolkeregisterIdent } from './Oppgavetabell';
import { behandlingstemaTilTekst, Oppgave, oppgaveBehandlingstypeTilTekst } from './typer/oppgave';
import { oppgaveTypeTilTekst, prioritetTilTekst } from './typer/oppgavetema';
import {
    formaterIsoDato,
    formaterNullableIsoDato,
    formaterNullableIsoDatoTid,
} from '../../utils/dato';

const Oppgaverad: React.FC<{ oppgave: Oppgave; mapper: Record<number, string> }> = ({
    oppgave,
    mapper,
}) => {
    const [anker, settAnker] = useState<Element | null>(null);

    const togglePopover = (element: React.MouseEvent<HTMLElement>) => {
        settAnker(anker ? null : element.currentTarget);
    };
    const oppgavetype = oppgave.oppgavetype && oppgaveTypeTilTekst[oppgave.oppgavetype];

    const fristFerdigstillelseDato =
        oppgave.fristFerdigstillelse && formaterIsoDato(oppgave.fristFerdigstillelse);

    const prioritet = oppgave.prioritet && prioritetTilTekst[oppgave.prioritet];
    const enhetsmappe = oppgave.mappeId && mapper[oppgave.mappeId];

    const behandlingstema =
        oppgave.behandlingstema && behandlingstemaTilTekst[oppgave.behandlingstema];

    const behandlingstype =
        oppgave.behandlingstype && oppgaveBehandlingstypeTilTekst[oppgave.behandlingstype];

    const typeBehandling = behandlingstype
        ? behandlingstema
            ? behandlingstype + ' - ' + behandlingstema
            : behandlingstype
        : behandlingstema;
    return (
        <Table.Row key={oppgave.id}>
            <Table.DataCell onMouseEnter={togglePopover} onMouseLeave={togglePopover}>
                {formaterNullableIsoDato(oppgave.opprettetTidspunkt)}
                <Popover
                    id={`registreringstidspunkt-for-oppgave-${oppgave.id}`}
                    anchorEl={anker}
                    open={!!anker}
                    onClose={() => settAnker(null)}
                    placement={'right'}
                    tabIndex={-1}
                >
                    <Popover.Content>
                        Registreringstidspunkt:{' '}
                        {formaterNullableIsoDatoTid(oppgave.opprettetTidspunkt)}
                    </Popover.Content>
                </Popover>
            </Table.DataCell>
            <Table.DataCell>{oppgavetype}</Table.DataCell>
            <Table.DataCell>{typeBehandling}</Table.DataCell>
            <Table.DataCell>{fristFerdigstillelseDato}</Table.DataCell>
            <Table.DataCell>{prioritet}</Table.DataCell>
            <Table.DataCell>{oppgave.beskrivelse}</Table.DataCell>
            <Table.DataCell>{utledetFolkeregisterIdent(oppgave)}</Table.DataCell>
            <Table.DataCell>{oppgave.tildeltEnhetsnr}</Table.DataCell>
            <Table.DataCell>{enhetsmappe}</Table.DataCell>
            <Table.DataCell>
                <Oppgaveknapp oppgave={oppgave} />
            </Table.DataCell>
        </Table.Row>
    );
};

export default Oppgaverad;
