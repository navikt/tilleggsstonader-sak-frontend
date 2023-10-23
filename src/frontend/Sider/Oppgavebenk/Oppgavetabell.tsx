import React, { useMemo } from 'react';

import styled from 'styled-components';

import { Pagination, Table } from '@navikt/ds-react';

import Oppgaverad from './Oppgaverad';
import { Mappe } from './typer/mappe';
import { IdentGruppe, Oppgave } from './typer/oppgave';
import { useOppgave } from '../../context/OppgaveContext';
import { usePagineringState } from '../../hooks/felles/usePaginerState';
import { useSorteringState } from '../../hooks/felles/useSorteringState';
import { PartialRecord } from '../../typer/common';

const FlexBox = styled.div`
    display: flex;
    justify-content: center;
`;

interface Props {
    oppgaver: Oppgave[];
}

const tabellHeaders: PartialRecord<keyof Oppgave, { tittel: string; erSorterbar?: boolean }> = {
    opprettetTidspunkt: { tittel: 'Reg. dato', erSorterbar: true },
    oppgavetype: { tittel: 'Oppgavetype', erSorterbar: true },
    behandlingstema: { tittel: 'Gjelder', erSorterbar: true },
    fristFerdigstillelse: { tittel: 'Frist', erSorterbar: true },
    prioritet: { tittel: 'Prioritet', erSorterbar: true },
    beskrivelse: { tittel: 'Beskrivelse' },
    tildeltEnhetsnr: { tittel: 'Enhet' },
    identer: { tittel: 'Ident' },
    mappeId: { tittel: 'Enhetsmappe', erSorterbar: true },
    tilordnetRessurs: { tittel: 'Saksbehandler' },
};

export const utledetFolkeregisterIdent = (oppgave: Oppgave) =>
    oppgave.identer?.filter((i) => i.gruppe === IdentGruppe.FOLKEREGISTERIDENT)[0].ident ||
    'Ukjent ident';

const mapMapperAsRecord = (mapper: Mappe[]): Record<number, string> =>
    mapper.reduce(
        (acc, item) => {
            acc[item.id] = item.navn;
            return acc;
        },
        {} as Record<number, string>
    );

const Oppgavetabell: React.FC<Props> = ({ oppgaver }) => {
    const { mapper } = useOppgave();
    const mapperAsRecord = useMemo(() => mapMapperAsRecord(mapper), [mapper]);

    const { sortertListe, settSortering, sortState } = useSorteringState<Oppgave>(oppgaver, {
        orderBy: 'fristFerdigstillelse',
        direction: 'ascending',
    });

    const { valgtSide, settValgtSide, slicedListe, antallSider } = usePagineringState(
        sortertListe,
        1,
        15
    );

    return (
        <>
            {antallSider > 1 && (
                <FlexBox>
                    <Pagination page={valgtSide} count={antallSider} onPageChange={settValgtSide} />
                </FlexBox>
            )}
            <Table
                size="small"
                sort={sortState}
                onSortChange={(sortKey) => settSortering(sortKey as keyof Oppgave)}
            >
                <Table.Header>
                    <Table.Row>
                        {Object.entries(tabellHeaders).map(([key, value], indeks) => (
                            <Table.ColumnHeader
                                key={`${indeks}${key}`}
                                sortKey={key}
                                sortable={value.erSorterbar}
                            >
                                {value.tittel}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {slicedListe.map((oppgave) => (
                        <Oppgaverad key={oppgave.id} oppgave={oppgave} mapper={mapperAsRecord} />
                    ))}
                </Table.Body>
            </Table>
        </>
    );
};

export default Oppgavetabell;
