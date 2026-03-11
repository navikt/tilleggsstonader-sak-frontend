import React, { FC } from 'react';

import { DagligReiseBeregningstabell } from '../../../../komponenter/DagligReiseBeregningstabell';
import { DetaljertBeregningsperioder } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';

interface Props {
    detaljertBeregningsperioder?: DetaljertBeregningsperioder[];
}

export const Vedtaksdetaljer: FC<Props> = ({ detaljertBeregningsperioder }) => {
    if (!detaljertBeregningsperioder) {
        return <>Ingen beregningsdetaljer</>;
    }

    return <DagligReiseBeregningstabell perioder={detaljertBeregningsperioder} />;
};
