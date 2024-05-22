import React from 'react';

import styled from 'styled-components';

import { Pagination, Table } from '@navikt/ds-react';
import { SortState } from '@navikt/ds-react/src/table/types';

import Oppgaverad from './Oppgaverad';
import { defaultSortering, utledAntallSider, utledSide } from './oppgaverequestUtil';
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
    width: 1100px;
`;
interface Props {
    oppgaverResponse: OppgaverResponse;
}

const tabellHeaders: PartialRecord<keyof Oppgave, { tittel: string; orderBy?: OppgaveOrderBy }> = {
    oppgavetype: { tittel: 'Oppgavetype' },
    behandlingstema: { tittel: 'Stønad' },
    opprettetTidspunkt: { tittel: 'Opprettet', orderBy: 'OPPRETTET_TIDSPUNKT' },
    identer: { tittel: 'Ident' },
    tilordnetRessurs: { tittel: 'Saksbehandler' },
};

export const utledetFolkeregisterIdent = (oppgave: Oppgave) =>
    oppgave.identer?.filter((i) => i.gruppe === IdentGruppe.FOLKEREGISTERIDENT)[0].ident ||
    'Ukjent ident';

const utledKeyForOrderBy = (oppgaveRequest: OppgaveRequest): keyof Oppgave => {
    const orderBy = Object.entries(tabellHeaders).find(
        ([, { orderBy }]) => orderBy && orderBy === oppgaveRequest.orderBy
    )?.[0] as keyof Oppgave;
    return orderBy ?? 'opprettetTidspunkt';
};

const utledOrderByFraKey = (oppgaveKey: keyof Oppgave): OppgaveOrderBy =>
    Object.entries(tabellHeaders).find(([key]) => key === oppgaveKey)?.[1].orderBy ??
    defaultSortering.orderBy;

const utledTabellSort = (oppgaveRequest: OppgaveRequest): SortState => ({
    orderBy: utledKeyForOrderBy(oppgaveRequest),
    direction: oppgaveRequest.order === 'ASC' ? 'ascending' : 'descending',
});

const Oppgavetabell: React.FC<Props> = ({ oppgaverResponse }) => {
    const { oppgaveRequest, settOppgaveRequest, hentOppgaver } = useOppgave();
    const side = utledSide(oppgaveRequest);
    const antallSider = utledAntallSider(oppgaverResponse);

    const oppdaterValgtSide = (valgtSide: number) => {
        const oppdatertOppgaveRequest: OppgaveRequest = {
            ...oppgaveRequest,
            offset: (valgtSide - 1) * defaultSortering.offset,
        };
        settOppgaveRequest(oppdatertOppgaveRequest);
        hentOppgaver(oppdatertOppgaveRequest);
    };

    const oppdaterSortering = (orderKey: keyof Oppgave) => {
        const oppdatertOppgaveRequest: OppgaveRequest = {
            ...oppgaveRequest,
            orderBy: utledOrderByFraKey(orderKey),
            order: oppgaveRequest.order === 'ASC' ? 'DESC' : 'ASC',
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
