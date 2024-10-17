import React from 'react';

import styled from 'styled-components';

import { Table, VStack } from '@navikt/ds-react';

import { ArenaSak, ArenaVedtak } from './vedtakArena';
import { formaterNullableIsoDato, formaterNullablePeriode } from '../../../../utils/dato';

const Vedtakinfotabell = styled(Table)`
    max-width: fit-content;
`;

export function Vedtaksdetaljer({
    vedtak,
    sak,
}: {
    vedtak: ArenaVedtak;
    sak: ArenaSak | undefined;
}) {
    return (
        <VStack gap={'8'}>
            <Vedtaksinfo vedtak={vedtak} sak={sak} />
            <Vedtaksfakta vedtak={vedtak} />
            <Vilkårsvurderinger vedtak={vedtak} />
        </VStack>
    );
}

const formaterAktivitet = (sak: ArenaSak | undefined) =>
    sak?.aktivitet &&
    ` (${sak?.aktivitet.status} ${formaterNullablePeriode(sak?.aktivitet.fom, sak?.aktivitet.tom)})`;

function Vedtaksinfo({ vedtak, sak }: { vedtak: ArenaVedtak; sak: ArenaSak | undefined }) {
    type Vedtakinfo = [string, string | number | undefined];

    const beskrivelseAktivitet: Vedtakinfo[] = sak?.aktivitet?.beskrivelse
        ? [['Beskrivelse', sak.aktivitet.beskrivelse]]
        : [];
    const vedtakinfo: Vedtakinfo[] = [
        ['Sak', vedtak.sakId],
        ['Saksbehandler', vedtak.saksbehandler],
        ['Beslutter', vedtak.beslutter],
        ['Dato mottatt', formaterNullableIsoDato(vedtak.datoMottatt)],
        ['Målgruppe', sak?.målgruppe],
        ['Aktivitet', formaterAktivitet(sak)],
        ...beskrivelseAktivitet,
    ];
    return (
        <Vedtakinfotabell size={'small'}>
            <Table.Body>
                {vedtakinfo.map((info) => (
                    <Table.Row key={info[0]}>
                        <Table.DataCell>
                            <strong>{info[0]}</strong>
                        </Table.DataCell>
                        <Table.DataCell>{info[1]}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Vedtakinfotabell>
    );
}

function Vilkårsvurderinger({ vedtak }: { vedtak: ArenaVedtak }) {
    if (!vedtak.vilkårsvurderinger.length) {
        return null;
    }
    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Vilkår</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Vurdering</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Vurdert av</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtak.vilkårsvurderinger.map((vilkårsvurdering, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>{vilkårsvurdering.vilkår}</Table.DataCell>
                        <Table.DataCell>{vilkårsvurdering.vurdering}</Table.DataCell>
                        <Table.DataCell>{vilkårsvurdering.vurdertAv}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

function Vedtaksfakta({ vedtak }: { vedtak: ArenaVedtak }) {
    if (!vedtak.vedtakfakta.length) {
        return null;
    }
    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Vedtaksfakta</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Verdi</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtak.vedtakfakta.map((fakta, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>{fakta.type}</Table.DataCell>
                        <Table.DataCell>{fakta.verdi}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}
