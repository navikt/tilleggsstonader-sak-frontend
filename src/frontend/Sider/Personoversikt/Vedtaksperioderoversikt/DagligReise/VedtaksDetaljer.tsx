import React, { FC } from 'react';

import { DagligReiseBeregningstabell } from '../../../../komponenter/DagligReiseBeregningstabell';
import { DetaljertBeregningsperioderDagligReise } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';

interface Props {
    detaljertBeregningsperioder?: DetaljertBeregningsperioderDagligReise[];
    className?: string;
}

export const Vedtaksdetaljer: FC<Props> = ({ detaljertBeregningsperioder, className }) => {
    if (!detaljertBeregningsperioder) {
        return <>Ingen beregningsdetaljer</>;
    }

    return (
        <DagligReiseBeregningstabell perioder={detaljertBeregningsperioder} className={className} />
    );
};
