import React from 'react';

import { Table } from '@navikt/ds-react';

import { vedtakErAvslag, VedtakBarnetilsyn } from '../../../../typer/vedtak/vedtakTilsynBarn';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import { faktiskMålgruppeTilTekst } from '../../Felles/faktiskMålgruppe';
import { aktivitetTypeTilTekst } from '../../Inngangsvilkår/Aktivitet/utilsAktivitet';

type Props = {
    vedtakBarnetilsyn: VedtakBarnetilsyn;
};

const VedtakshistorikkTilsynBarnTabellVisning: React.FC<Props> = ({ vedtakBarnetilsyn }) => {
    if (vedtakErAvslag(vedtakBarnetilsyn)) return 'Ingen vedtakshistorikk';
    if (vedtakBarnetilsyn?.beregningsresultat?.vedtaksperioder === undefined) {
        return 'Ingen vedtakshistorikk';
    }
    return (
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til.</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Målgruppe</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Ant. barn</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtakBarnetilsyn.beregningsresultat.vedtaksperioder?.map(
                    ({ fom, tom, målgruppe, aktivitet, antallBarn }) => {
                        return (
                            <Table.Row key={fom}>
                                <Table.DataCell>{formaterNullableIsoDato(fom)}</Table.DataCell>
                                <Table.DataCell>{formaterNullableIsoDato(tom)}</Table.DataCell>
                                <Table.DataCell>{aktivitetTypeTilTekst(aktivitet)}</Table.DataCell>
                                <Table.DataCell>
                                    {faktiskMålgruppeTilTekst(målgruppe)}
                                </Table.DataCell>
                                <Table.DataCell>{antallBarn}</Table.DataCell>
                            </Table.Row>
                        );
                    }
                )}
            </Table.Body>
        </Table>
    );
};

export default VedtakshistorikkTilsynBarnTabellVisning;
