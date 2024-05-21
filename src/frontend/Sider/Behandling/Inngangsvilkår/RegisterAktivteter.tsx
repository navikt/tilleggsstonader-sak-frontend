import React from 'react';

import { styled } from 'styled-components';

import { Button, Heading, Table } from '@navikt/ds-react';

import { Registeraktivitet } from '../../../typer/registeraktivitet';
import { formaterNullableIsoDato } from '../../../utils/dato';

const Tabell = styled(Table)`
    width: 50%;
`;

const RegisterAktiviteter: React.FC<{ aktiviteter: Registeraktivitet[] }> = ({ aktiviteter }) => {
    return (
        <div>
            <Heading size="small">Brukers registrerte aktiviteter</Heading>
            <Tabell size={'small'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Startdato</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Sluttdato</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Aktivitetsdager</Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {aktiviteter.map((aktivitet) => {
                        return (
                            <Table.Row key={aktivitet.id}>
                                <Table.DataCell>{aktivitet.type}</Table.DataCell>
                                <Table.DataCell>{aktivitet.typeNavn}</Table.DataCell>
                                <Table.DataCell>
                                    {formaterNullableIsoDato(aktivitet.fom)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {formaterNullableIsoDato(aktivitet.tom)}
                                </Table.DataCell>
                                <Table.DataCell>{aktivitet.antallDagerPerUke}</Table.DataCell>
                                <Table.DataCell>
                                    {/*Skjules fordi knappen ikke har noen funksjon enda*/}
                                    {false && (
                                        <Button
                                            size={'small'}
                                            onClick={() => console.log('Legg til aktivitet')}
                                        >
                                            Legg til
                                        </Button>
                                    )}
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Tabell>
        </div>
    );
};

export default RegisterAktiviteter;
