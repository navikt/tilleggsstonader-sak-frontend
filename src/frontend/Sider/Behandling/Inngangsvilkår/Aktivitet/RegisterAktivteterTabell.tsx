import React from 'react';

import { styled } from 'styled-components';

import { Button, Table } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { formaterEnumVerdi } from '../../../../utils/tekstformatering';
import { Aktivitet } from '../typer/aktivitet';

const Tabell = styled(Table)`
    background: white;
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const RegisterAktiviteterTabell: React.FC<{
    aktiviteterFraArena: Registeraktivitet[];
    leggTilAktivitetFraRegister: (aktivitet: Registeraktivitet) => void;
}> = ({ aktiviteterFraArena, leggTilAktivitetFraRegister }) => {
    const { erStegRedigerbart } = useSteg();
    const { aktiviteter } = useInngangsvilkår();

    function erAktivitetAlleredeLagtTil(
        aktiviteter: Aktivitet[],
        aktiviteterFraArena: Registeraktivitet[]
    ) {
        return aktiviteter
            .filter((aktivitet) => aktivitet.kildeId !== undefined)
            .some((aktivitet) =>
                aktiviteterFraArena
                    .map((aktivitet) => aktivitet.id)
                    .includes(aktivitet.kildeId as string)
            );
    }

    return (
        <Tabell size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Startdato</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Sluttdato</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Aktivitetsdager</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {aktiviteterFraArena.map((aktivitet) => {
                    return (
                        <Table.Row key={aktivitet.id}>
                            <Table.DataCell>{aktivitet.typeNavn}</Table.DataCell>
                            <Table.DataCell>
                                {aktivitet.status && formaterEnumVerdi(aktivitet.status)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(aktivitet.fom)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(aktivitet.tom)}
                            </Table.DataCell>
                            <Table.DataCell>{aktivitet.antallDagerPerUke ?? '-'}</Table.DataCell>
                            <Table.DataCell>
                                {erStegRedigerbart && (
                                    <Button
                                        size="xsmall"
                                        onClick={() => leggTilAktivitetFraRegister(aktivitet)}
                                    >
                                        {erAktivitetAlleredeLagtTil(
                                            aktiviteter,
                                            aktiviteterFraArena
                                        )
                                            ? 'Brukt'
                                            : 'Bruk'}
                                    </Button>
                                )}
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Tabell>
    );
};

export default RegisterAktiviteterTabell;
