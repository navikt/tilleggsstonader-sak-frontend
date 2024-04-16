import React from 'react';

import { styled } from 'styled-components';

import { Table } from '@navikt/ds-react';

import { Registeraktivitet, statutAktivitetTilTekst } from '../../../typer/registeraktivitet';
import { formaterNullableIsoDato } from '../../../utils/dato';
import { formatBoolean } from '../../../utils/tekstformatering';

const Tabell = styled(Table)`
    width: 70%;
`;

const Aktiviteter: React.FC<{ aktiviteter: Registeraktivitet[] }> = ({ aktiviteter }) => {
    return (
        <Tabell size={'small'} zebraStripes={true}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fom</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tom</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Arrangør</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Aktivitetsdager</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Stønadsberettiget</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Utdanning</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {aktiviteter.map((aktivitet) => {
                    return (
                        <Table.Row key={aktivitet.id}>
                            <Table.DataCell>
                                {formaterNullableIsoDato(aktivitet.fom)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(aktivitet.tom)}
                            </Table.DataCell>
                            <Table.DataCell>{aktivitet.typeNavn}</Table.DataCell>
                            <Table.DataCell>
                                {aktivitet.status && statutAktivitetTilTekst[aktivitet.status]}
                            </Table.DataCell>
                            <Table.DataCell>{aktivitet.arrangør}</Table.DataCell>
                            <Table.DataCell>{aktivitet.antallDagerPerUke}</Table.DataCell>
                            <Table.DataCell>
                                {formatBoolean(aktivitet.erStønadsberettiget)}
                            </Table.DataCell>
                            <Table.DataCell>{formatBoolean(aktivitet.erUtdanning)}</Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Tabell>
    );
};

export default Aktiviteter;
