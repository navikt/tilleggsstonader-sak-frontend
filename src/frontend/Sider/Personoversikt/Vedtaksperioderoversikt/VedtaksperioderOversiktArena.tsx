import React from 'react';

import { Table } from '@navikt/ds-react';

import { OversiktKort } from './OversiktKort';
import { formaterNullableIsoDato, formaterNullablePeriode } from '../../../utils/dato';
import { ArenaSakOgVedtak } from '../Behandlingsoversikt/Arena/vedtakArena';
import { Vedtaksdetaljer } from '../Behandlingsoversikt/Arena/Vedtaksdetaljer';

export const VedtaksperioderOversiktArena: React.FC<{ arenaSakOgVedtak: ArenaSakOgVedtak }> = ({
    arenaSakOgVedtak,
}) => {
    return (
        <OversiktKort tittel={'TS vedtak i Arena'} tagTittel={'Arena'} tagVariant={'info'}>
            <Table size={'small'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Rettighetstype</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Utfall</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Dato innstillt</Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {arenaSakOgVedtak.vedtak.map((vedtak, index) => {
                        const sak = arenaSakOgVedtak.saker[vedtak.sakId];
                        return (
                            <Table.ExpandableRow
                                key={index}
                                content={<Vedtaksdetaljer vedtak={vedtak} sak={sak} />}
                                togglePlacement={'right'}
                            >
                                <Table.DataCell>{vedtak.rettighet}</Table.DataCell>
                                <Table.DataCell>{vedtak.type}</Table.DataCell>
                                <Table.DataCell>{vedtak.utfall}</Table.DataCell>
                                <Table.DataCell>
                                    {formaterNullablePeriode(vedtak.fom, vedtak.tom)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {formaterNullableIsoDato(vedtak.datoInnstillt)}
                                </Table.DataCell>
                            </Table.ExpandableRow>
                        );
                    })}
                </Table.Body>
            </Table>
        </OversiktKort>
    );
};
