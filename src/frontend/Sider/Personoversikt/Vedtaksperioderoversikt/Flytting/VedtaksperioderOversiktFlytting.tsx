import React from 'react';

import { Table } from '@navikt/ds-react';

import { BeregningsgrunnlagType } from '../../../../typer/vedtak/vedtakFlytting';
import { DetaljertVedtaksperiodeFlytting } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterIsoDato } from '../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../utils/fomatering';
import { faktiskMålgruppeTilTekst } from '../../../Behandling/Felles/faktiskMålgruppe';
import { BorderTable } from '../VedtaksperioderBorderTable';

const flyttemåteTilTekst: Record<BeregningsgrunnlagType, string> = {
    [BeregningsgrunnlagType.FLYTTEBYRÅ]: 'Flyttebyrå',
    [BeregningsgrunnlagType.FLYTTE_SELV]: 'Flytter selv',
};

interface Props {
    border?: boolean;
    vedtaksperioder: DetaljertVedtaksperiodeFlytting[];
}

export const VedtaksperioderOversiktFlytting: React.FC<Props> = ({ border, vedtaksperioder }) => {
    return (
        <BorderTable size="small" $border={border}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Flyttedato</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Flyttemåte</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Målgruppe</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Utbetales</Table.HeaderCell>
                    <Table.HeaderCell scope="col" align="right">
                        Beløp
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vedtaksperioder.map((periode, index) => (
                    <Table.Row key={`${periode.stønadstype}-${periode.flyttedato}-${index}`}>
                        <Table.HeaderCell scope="row">
                            {formaterIsoDato(periode.flyttedato)}
                        </Table.HeaderCell>
                        <Table.DataCell>{flyttemåteTilTekst[periode.flyttemåte]}</Table.DataCell>
                        <Table.DataCell>
                            {faktiskMålgruppeTilTekst(periode.målgruppe)}
                        </Table.DataCell>
                        <Table.DataCell>{periode.skalUtbetales ? 'Ja' : 'Nei'}</Table.DataCell>
                        <Table.DataCell align="right">
                            {formaterTallMedTusenSkille(periode.beløp)} kr
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </BorderTable>
    );
};
