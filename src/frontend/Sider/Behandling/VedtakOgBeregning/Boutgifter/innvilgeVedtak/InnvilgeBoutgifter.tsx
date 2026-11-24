import React from 'react';

import { BeregningsresultatContainer } from './BeregningsresultatContainer';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { InnvilgelseBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { InnvilgeVedtak } from '../../Felles/InnvilgeVedtak';

interface Props {
    lagretVedtak?: InnvilgelseBoutgifter;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}

export const InnvilgeBoutgifter: React.FC<Props> = ({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
}) => {
    const { behandling } = useBehandling();

    return (
        <InnvilgeVedtak
            lagretVedtak={lagretVedtak}
            vedtaksperioderForrigeBehandling={vedtaksperioderForrigeBehandling}
            vedtakUrl={`/api/sak/vedtak/boutgifter/${behandling.id}`}
            visBeregningsresultat={(beregningsresultat) => (
                <BeregningsresultatContainer beregningsresultat={beregningsresultat} />
            )}
            tidligsteEndring={(beregningsresultat) => beregningsresultat.tidligsteEndring}
        />
    );
};
