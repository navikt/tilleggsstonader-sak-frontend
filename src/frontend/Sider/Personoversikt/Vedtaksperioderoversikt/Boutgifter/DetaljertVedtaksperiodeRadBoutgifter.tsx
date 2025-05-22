import React from 'react';

import { LøpendeUtgiftRad } from './LøpendeUtgiftRad';
import { SamlingRad } from './SamlingRad';
import { DetaljertVedtaksperiodeBoutgifter } from '../../../../typer/vedtak/vedtaksperiodeOppsummering';

export const DetaljertVedtaksperiodeRadBoutgifter: React.FC<{
    detaljertBoutgift: DetaljertVedtaksperiodeBoutgifter;
    inneholderLøpendeUtgifter: boolean;
}> = ({ detaljertBoutgift, inneholderLøpendeUtgifter }) => {
    if (detaljertBoutgift.erLøpendeUtgift) {
        return <LøpendeUtgiftRad detaljertBoutgift={detaljertBoutgift} />;
    }

    return (
        <SamlingRad
            detaljertBoutgift={detaljertBoutgift}
            skalInneholdeAntMndKolonne={inneholderLøpendeUtgifter}
        />
    );
};
