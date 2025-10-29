import React from 'react';

import { styled } from 'styled-components';

import { Table } from '@navikt/ds-react';
import { BorderNeutralSubtle } from '@navikt/ds-tokens/darkside-js';

import { BrukAktivitetKnapp } from './BrukAktivitetKnapp';
import { erRegisterAktivitetBrukt } from './utilsAktivitet';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { TableDataCellSmall, TableHeaderCellSmall } from '../../../../komponenter/TabellSmall';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { formaterEnumVerdi } from '../../../../utils/tekstformatering';
import { AktivitetType, AktivitetTypeTilTekst } from '../typer/vilkårperiode/aktivitet';

const Tabell = styled(Table)`
    --ac-table-row-border: ${BorderNeutralSubtle};
    --ac-table-row-hover: none;
    --ac-table-cell-hover-border: ${BorderNeutralSubtle};
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
                    <TableHeaderCellSmall scope="col">Type</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Variant</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Arrangør</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Status</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Startdato</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Sluttdato</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Aktivitetsdager</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Prosent</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col">Id</TableHeaderCellSmall>
                    <TableHeaderCellSmall scope="col" />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {registerAktivitet.map((aktivitet) => {
                    const erAktivitetBrukt = erRegisterAktivitetBrukt(aktiviteter, aktivitet);

                    return (
                        <Table.Row key={aktivitet.id}>
                            <TableDataCellSmall>
                                {utledVisningstekstForAktivitetType(aktivitet)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>{aktivitet.typeNavn}</TableDataCellSmall>
                            <TableDataCellSmall>{aktivitet.arrangør ?? '-'}</TableDataCellSmall>
                            <TableDataCellSmall>
                                {aktivitet.status && formaterEnumVerdi(aktivitet.status)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {formaterNullableIsoDato(aktivitet.fom)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {formaterNullableIsoDato(aktivitet.tom)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {aktivitet.antallDagerPerUke ?? '-'}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {aktivitet.prosentDeltakelse ?? '-'}
                            </TableDataCellSmall>
                            <TableDataCellSmall>{aktivitet.id}</TableDataCellSmall>
                            <TableDataCellSmall>
                                <BrukAktivitetKnapp
                                    registerAktivitet={aktivitet}
                                    leggTilAktivitetFraRegister={leggTilAktivitetFraRegister}
                                    harBruktAktivitet={erAktivitetBrukt}
                                />
                            </TableDataCellSmall>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Tabell>
    );
};

export default RegisterAktiviteterTabell;
