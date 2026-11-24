import React from 'react';

import { Beregningsresultat } from './Beregningsresultat/Beregningsresultat';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { BeregningsplanOmfang } from '../../../../../typer/vedtak/beregningsplan';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { InnvilgelseReiseOppstartAvslutningHjemreise } from '../../../../../typer/vedtak/vedtakReiseOppstartAvslutningHjemreise';
import { InnvilgeVedtak } from '../../Felles/InnvilgeVedtak';

interface Props {
    lagretVedtak?: InnvilgelseReiseOppstartAvslutningHjemreise;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}

export const InnvilgeReiseOppstartAvslutningHjemreise: React.FC<Props> = ({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
}) => {
    const { behandling } = useBehandling();

    const gjelderTsr =
        behandling.stønadstype === Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR;
    const beregningsplan = lagretVedtak?.beregningsresultat?.beregningsplan;

    return (
        <InnvilgeVedtak
            lagretVedtak={lagretVedtak}
            vedtaksperioderForrigeBehandling={vedtaksperioderForrigeBehandling}
            vedtakUrl={`/api/sak/vedtak/reise-oppstart-avslutning-hjemreise/${behandling.id}/${gjelderTsr ? 'tsr' : 'tso'}`}
            visBeregningsresultat={(beregningsresultat) => (
                <Beregningsresultat beregningsresultat={beregningsresultat} />
            )}
            tidligsteEndring={
                beregningsplan?.omfang === BeregningsplanOmfang.FRA_DATO
                    ? beregningsplan.tidligsteEndring
                    : undefined
            }
        />
    );
};
