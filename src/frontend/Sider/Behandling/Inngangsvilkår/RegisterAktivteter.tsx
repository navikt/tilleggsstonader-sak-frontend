import React from 'react';

import { styled } from 'styled-components';

import { Alert, Button, Heading, Table } from '@navikt/ds-react';

import { RegisterAktivteter } from './typer/vilkårperiode';
import { useInngangsvilkår } from '../../../context/InngangsvilkårContext';
import { formaterNullableIsoDato } from '../../../utils/dato';

const Tabell = styled(Table)`
    width: 50%;
`;

const RegisterAktiviteter: React.FC<{ aktivitetGrunnlag: RegisterAktivteter }> = ({
    aktivitetGrunnlag,
}) => {
    const { leggTilAktivitetFraRegister } = useInngangsvilkår();
    return (
        <div>
            <Heading size="small">Brukers registrerte aktiviteter</Heading>
            {aktivitetGrunnlag.aktiviteter.length > 0 ? (
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
                        {aktivitetGrunnlag.aktiviteter.map((aktivitet) => {
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
                                        <Button
                                            size={'small'}
                                            onClick={() => leggTilAktivitetFraRegister(aktivitet)}
                                        >
                                            Legg til
                                        </Button>
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Tabell>
            ) : (
                <Alert variant={'info'} inline>
                    Bruker har ingen registrerte aktiviteter
                </Alert>
            )}
        </div>
    );
};

export default RegisterAktiviteter;
