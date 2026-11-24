import React from 'react';

import { Beregningsresultat } from './Beregningsresultat/Beregningsresultat';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { BeregningsplanOmfang } from '../../../../../typer/vedtak/beregningsplan';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { InnvilgelseReiseTilSamling } from '../../../../../typer/vedtak/vedtakReiseTilSamling';
import { InnvilgeVedtak } from '../../Felles/InnvilgeVedtak';

interface Props {
    lagretVedtak?: InnvilgelseReiseTilSamling;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}

export const InnvilgeReiseTilSamling: React.FC<Props> = ({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
}) => {
    const { behandling } = useBehandling();

    const gjelderTsr = behandling.stønadstype === Stønadstype.REISE_TIL_SAMLING_TSR;
    const beregningsplan = lagretVedtak?.beregningsresultat?.beregningsplan;

    return (
        <InnvilgeVedtak
            lagretVedtak={lagretVedtak}
            vedtaksperioderForrigeBehandling={vedtaksperioderForrigeBehandling}
            vedtakUrl={`/api/sak/vedtak/reise-til-samling/${behandling.id}/${gjelderTsr ? 'tsr' : 'tso'}`}
            skjulAktivitet={gjelderTsr}
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
