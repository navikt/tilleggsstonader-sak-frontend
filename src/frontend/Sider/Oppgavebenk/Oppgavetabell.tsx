import React from 'react';

import styled from 'styled-components';

import { Pagination, Table } from '@navikt/ds-react';
import { SortState } from '@navikt/ds-react/src/table/types';

import Oppgaverad from './Oppgaverad';
import {
    defaultSortering,
    OPPGAVE_SIDE_STØRRELSE,
    utledAntallSider,
    utledSide,
} from './oppgaverequestUtil';
import {
    IdentGruppe,
    Oppgave,
    OppgaveOrderBy,
    OppgaveRequest,
    OppgaverResponse,
} from './typer/oppgave';
import { useOppgave } from '../../context/OppgaveContext';
import { PartialRecord } from '../../typer/common';

const Tabell = styled(Table)`
    width: 1250px;
`;
interface Props {
    oppgaverResponse: OppgaverResponse;
    oppgaveRequest: OppgaveRequest;
    settOppgaveRequest: (oppgaveRequest: OppgaveRequest) => void;
}

const tabellHeaders: PartialRecord<keyof Oppgave, { tittel: string; orderBy?: OppgaveOrderBy }> = {
    oppgavetype: { tittel: 'Oppgavetype' },
    behandlingstema: { tittel: 'Stønad' },
    opprettetTidspunkt: { tittel: 'Opprettet', orderBy: 'OPPRETTET_TIDSPUNKT' },
    fristFerdigstillelse: { tittel: 'Frist', orderBy: 'FRIST' },
    identer: { tittel: 'Ident' },
    navn: { tittel: 'Navn' },
    tilordnetRessurs: { tittel: 'Tildelt' },
};

const orderByTilHeader: Record<OppgaveOrderBy, keyof Oppgave> = Object.entries(
    tabellHeaders
).reduce(
    (prev, [key, { orderBy }]) => ({
        ...prev,
        ...(orderBy ? { [orderBy]: key } : {}),
    }),
    {} as Record<OppgaveOrderBy, keyof Oppgave>
);

export const utledetFolkeregisterIdent = (oppgave: Oppgave) =>
    oppgave.identer?.filter((i) => i.gruppe === IdentGruppe.FOLKEREGISTERIDENT)[0].ident ||
    'Ukjent ident';

const utledOrderByFraKey = (oppgaveKey: keyof Oppgave): OppgaveOrderBy =>
    tabellHeaders[oppgaveKey]?.orderBy ?? defaultSortering.orderBy;

const utledTabellSort = (oppgaveRequest: OppgaveRequest): SortState => ({
    orderBy: orderByTilHeader[oppgaveRequest.orderBy] ?? 'opprettetTidspunkt',
    direction: oppgaveRequest.order === 'ASC' ? 'ascending' : 'descending',
});

const Oppgavetabell: React.FC<Props> = ({
    oppgaverResponse,
    oppgaveRequest,
    settOppgaveRequest,
}) => {
    const { hentOppgaver } = useOppgave();
    const side = utledSide(oppgaveRequest);
    const antallSider = utledAntallSider(oppgaverResponse);

    const oppdaterValgtSide = (valgtSide: number) => {
        const oppdatertOppgaveRequest: OppgaveRequest = {
            ...oppgaveRequest,
            offset: (valgtSide - 1) * OPPGAVE_SIDE_STØRRELSE,
        };
        settOppgaveRequest(oppdatertOppgaveRequest);
        hentOppgaver(oppdatertOppgaveRequest);
    };

    const oppdaterSortering = (orderKey: keyof Oppgave) => {
        const oppdatertOppgaveRequest: OppgaveRequest = {
            ...oppgaveRequest,
            orderBy: utledOrderByFraKey(orderKey),
            order: oppgaveRequest.order === 'ASC' ? 'DESC' : 'ASC',
            offset: 0,
        };
        settOppgaveRequest(oppdatertOppgaveRequest);
        hentOppgaver(oppdatertOppgaveRequest);
    };

    return (
        <>
            <Tabell
                size="small"
                sort={utledTabellSort(oppgaveRequest)}
                onSortChange={(sortKey) => oppdaterSortering(sortKey as keyof Oppgave)}
                zebraStripes
            >
                <Table.Header>
                    <Table.Row>
                        {Object.entries(tabellHeaders).map(([key, value], indeks) => (
                            <Table.ColumnHeader
                                key={`${indeks}${key}`}
                                sortKey={key}
                                sortable={!!value.orderBy}
                            >
                                {value.tittel}
                            </Table.ColumnHeader>
                        ))}
                        <Table.ColumnHeader /* Knapp */ />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {oppgaverResponse.oppgaver.map((oppgave) => (
                        <Oppgaverad key={oppgave.id} oppgave={oppgave} />
                    ))}
                </Table.Body>
            </Tabell>
            {antallSider > 1 && (
                <Pagination
                    page={side}
                    count={antallSider}
                    onPageChange={oppdaterValgtSide}
                    size="small"
                />
            )}
        </>
    );
};

export default Oppgavetabell;
