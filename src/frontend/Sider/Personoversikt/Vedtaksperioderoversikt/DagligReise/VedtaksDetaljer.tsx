import React, { FC } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { VedtaksdetaljerPrivatBil } from './VedtaksdetaljerPrivatBil';
import { DagligReiseBeregningstabell } from '../../../../komponenter/DagligReiseBeregningstabell';
import { RammeForReiseMedPrivatBil } from '../../../../typer/vedtak/vedtakDagligReise';
import { DetaljertBeregningsperioderDagligReise } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';

interface Props {
    detaljertBeregningsperioder?: DetaljertBeregningsperioderDagligReise[] | null;
    rammevedtakPrivatBil?: RammeForReiseMedPrivatBil | null;
    className?: string;
}

export const Vedtaksdetaljer: FC<Props> = ({
    detaljertBeregningsperioder,
    rammevedtakPrivatBil,
    className,
}) => {
    if (detaljertBeregningsperioder?.length) {
        return (
            <DagligReiseBeregningstabell
                perioder={detaljertBeregningsperioder}
                className={className}
            />
        );
    }

    if (rammevedtakPrivatBil) {
        return (
            <VedtaksdetaljerPrivatBil
                rammevedtakPrivatBil={rammevedtakPrivatBil}
                className={className}
            />
        );
    }

    return <BodyShort size="small">Ingen beregningsdetaljer</BodyShort>;
};
