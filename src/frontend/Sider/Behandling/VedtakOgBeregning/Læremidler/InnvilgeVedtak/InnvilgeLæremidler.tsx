import React, { useState } from 'react';

import { BekreftNyBeregningModal } from './BekreftNyBeregningModal';
import { Beregningsresultat } from './Beregningsresultat';
import { useBehandling } from '../../../../../context/BehandlingContext';
import {
    BeregningsresultatLæremidler,
    InnvilgelseLæremidler,
} from '../../../../../typer/vedtak/vedtakLæremidler';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { InnvilgeVedtak } from '../../Felles/InnvilgeVedtak';

export const InnvilgeLæremidler: React.FC<{
    lagretVedtak: InnvilgelseLæremidler | undefined;
    vedtaksperioderForrigeBehandling: Vedtaksperiode[] | undefined;
}> = ({ lagretVedtak, vedtaksperioderForrigeBehandling }) => {
    const { behandling } = useBehandling();
    const [visNyBeregningVarsel, settVisNyBeregningVarsel] = useState(false);

    /*
    Den nye beregningen kan føre til en periode mindre utbetalt enn forespeilet
    for behandlinger som har endringer før 1. januar 2026.
    Saksbehandler skal derfor varsles om dette.
    Varselet kan fjernes når vi er sikre på at saksbehandler ikke lenger endrer på vedtak før 1. januar 2026
     */
    const håndterSkalViseNyBeregningVarsel = (beregningsresultat: BeregningsresultatLæremidler) => {
        const { tidligsteEndring } = beregningsresultat;
        if (tidligsteEndring && new Date(tidligsteEndring) < new Date('2026-01-01')) {
            settVisNyBeregningVarsel(true);
        }
    };

    return (
        <InnvilgeVedtak
            lagretVedtak={lagretVedtak}
            vedtaksperioderForrigeBehandling={vedtaksperioderForrigeBehandling}
            vedtakUrl={`/api/sak/vedtak/laremidler/${behandling.id}`}
            lagBeregnRequest={(vedtaksperioder) => vedtaksperioder}
            onBeregnet={håndterSkalViseNyBeregningVarsel}
            visBeregningsresultat={(beregningsresultat) => (
                <Beregningsresultat beregningsresultat={beregningsresultat} />
            )}
            tidligsteEndring={(beregningsresultat) => beregningsresultat.tidligsteEndring}
        >
            <BekreftNyBeregningModal
                visBekreftModal={visNyBeregningVarsel}
                settVisBekreftModal={settVisNyBeregningVarsel}
            />
        </InnvilgeVedtak>
    );
};
