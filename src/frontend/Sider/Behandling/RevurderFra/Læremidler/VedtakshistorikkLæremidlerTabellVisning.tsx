import React from 'react';

import { Table } from '@navikt/ds-react';

import { vedtakErAvslag, VedtakLæremidler } from '../../../../typer/vedtak/vedtakLæremidler';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { aktivitetTypeTilTekst } from '../../Inngangsvilkår/Aktivitet/utilsAktivitet';
import { studienivåTilTekst } from '../../Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';
import { målgruppeTypeTilTekst } from '../../Inngangsvilkår/typer/vilkårperiode/målgruppe';

type Props = {
    vedtakLæremidler: VedtakLæremidler;
};

const VedtakshistorikkLæremidlerTabellVisning: React.FC<Props> = ({ vedtakLæremidler }) => {
    if (vedtakErAvslag(vedtakLæremidler)) return 'Ingen vedtakshistorikk';
    if (vedtakLæremidler?.beregningsresultat?.perioder === undefined) {
        return 'Ingen vedtakshistorikk';
    }
    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Målgruppe</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Studienivå</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Studieprosent</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtakLæremidler.beregningsresultat.perioder?.map(
                    ({ fom, tom, målgruppe, aktivitet, studienivå, studieprosent }) => {
                        return (
                            <Table.Row key={fom}>
                                <Table.DataCell>{formaterNullableIsoDato(fom)}</Table.DataCell>
                                <Table.DataCell>{formaterNullableIsoDato(tom)}</Table.DataCell>
                                <Table.DataCell>{målgruppeTypeTilTekst(målgruppe)}</Table.DataCell>
                                <Table.DataCell>{aktivitetTypeTilTekst(aktivitet)}</Table.DataCell>
                                <Table.DataCell>{studienivåTilTekst[studienivå]}</Table.DataCell>
                                <Table.DataCell>{studieprosent}</Table.DataCell>
                            </Table.Row>
                        );
                    }
                )}
            </Table.Body>
        </Table>
    );
};

export default VedtakshistorikkLæremidlerTabellVisning;
