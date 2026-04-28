import React, { FC } from 'react';

import { DagligReiseBeregningstabell } from '../../../../komponenter/DagligReiseBeregningstabell';
import { DetaljertBeregningsperioderDagligReise } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';

interface Props {
    detaljertBeregningsperioder?: DetaljertBeregningsperioderDagligReise[];
}

export const Vedtaksdetaljer: FC<Props> = ({ detaljertBeregningsperioder }) => {
    if (!detaljertBeregningsperioder) {
        return <>Ingen beregningsdetaljer</>;
    }

    return <DagligReiseBeregningstabell perioder={detaljertBeregningsperioder} />;
};
