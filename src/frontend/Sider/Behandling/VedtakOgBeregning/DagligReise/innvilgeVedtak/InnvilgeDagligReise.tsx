import React from 'react';

import { Beregningsresultat } from './Beregningsresultat/Beregningsresultat';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { InnvilgelseDagligReise } from '../../../../../typer/vedtak/vedtakDagligReise';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { InnvilgeVedtak } from '../../Felles/InnvilgeVedtak';

interface Props {
    lagretVedtak?: InnvilgelseDagligReise;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}

export const InnvilgeDagligReise: React.FC<Props> = ({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
}) => {
    const { behandling } = useBehandling();

    const gjelderTsr = behandling.stønadstype === Stønadstype.DAGLIG_REISE_TSR;

    // Lagret vedtak har rammevedtak på toppnivå, mens beregn-svaret har det inne i beregningen
    const lagretVedtakMedBeregning = lagretVedtak && {
        ...lagretVedtak,
        beregningsresultat: lagretVedtak.beregningsresultat && {
            beregningsresultat: lagretVedtak.beregningsresultat,
            rammevedtakPrivatBil: lagretVedtak.rammevedtakPrivatBil,
        },
    };

    return (
        <InnvilgeVedtak
            lagretVedtak={lagretVedtakMedBeregning}
            vedtaksperioderForrigeBehandling={vedtaksperioderForrigeBehandling}
            vedtakUrl={`/api/sak/vedtak/daglig-reise/${behandling.id}/${gjelderTsr ? 'tsr' : 'tso'}`}
            skjulAktivitet={gjelderTsr}
            visBeregningsresultat={(beregning) => (
                <Beregningsresultat
                    beregningsresultat={beregning.beregningsresultat}
                    rammevedtakPrivatBil={beregning.rammevedtakPrivatBil}
                />
            )}
            tidligsteEndring={(beregning) => beregning.beregningsresultat.tidligsteEndring}
        />
    );
};
