import React from 'react';

import { DetaljertVedtaksperiodeReiseTilSamling } from '../../../typer/vedtak/vedtaksperiodeOppsummering';

interface Props {
    border?: boolean;
    vedtaksperioder: DetaljertVedtaksperiodeReiseTilSamling[];
}

export const VedtaksperioderOversiktReiseTilSamling: React.FC<Props> = ({
    border,
    vedtaksperioder,
}) => {
    return (
        <>
            TODO: VedtaksperioderOversiktReiseTilSamling{' '}
            {vedtaksperioder.map((it) => it.stønadstype)}
            border: {border}
        </>
    );
};
