import React from 'react';

import { styled } from 'styled-components';

import { Table, Tag } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { BrukAktivitetKnapp } from './BrukAktivitetKnapp';
import { erRegisterAktivitetBrukt } from './utilsAktivitet';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { formaterEnumVerdi } from '../../../../utils/tekstformatering';
import { AktivitetType, AktivitetTypeTilTekst } from '../typer/vilkårperiode/aktivitet';

const Tabell = styled(Table)`
    background: white;
    --ac-table-row-border: ${ABorderDivider};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${ABorderDivider};
`;

const RegisterAktiviteterTabell: React.FC<{
    registerAktivitet: Registeraktivitet[];
    leggTilAktivitetFraRegister: (aktivitet: Registeraktivitet) => void;
}> = ({ registerAktivitet, leggTilAktivitetFraRegister }) => {
    const { aktiviteter } = useInngangsvilkår();

    const utledVisningstekstForAktivitetType = (aktivtet: Registeraktivitet) => {
        const aktivtetType = aktivtet.erUtdanning ? AktivitetType.UTDANNING : AktivitetType.TILTAK;
        return AktivitetTypeTilTekst[aktivtetType];
    };

    return (
        <Tabell size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Variant</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Arrangør</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Startdato</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Sluttdato</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Aktivitetsdager</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Prosent</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Id</Table.HeaderCell>
                    <Table.HeaderCell scope="col" />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {registerAktivitet.map((aktivitet) => {
                    const erAktivitetBrukt = erRegisterAktivitetBrukt(aktiviteter, aktivitet);

                    return (
                        <Table.Row key={aktivitet.id}>
                            <Table.DataCell>
                                {utledVisningstekstForAktivitetType(aktivitet)}
                            </Table.DataCell>
                            <Table.DataCell>{aktivitet.typeNavn}</Table.DataCell>
                            <Table.DataCell>{aktivitet.arrangør ?? '-'}</Table.DataCell>
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
                            <Table.DataCell>{aktivitet.prosentDeltakelse ?? '-'}</Table.DataCell>
                            <Table.DataCell>
                                {erAktivitetBrukt ? (
                                    <Tag size="small" variant="alt2">
                                        {aktivitet.id}
                                    </Tag>
                                ) : (
                                    aktivitet.id
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                <BrukAktivitetKnapp
                                    registerAktivitet={aktivitet}
                                    leggTilAktivitetFraRegister={leggTilAktivitetFraRegister}
                                    harBruktAktivitet={erAktivitetBrukt}
                                />
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Tabell>
    );
};

export default RegisterAktiviteterTabell;
