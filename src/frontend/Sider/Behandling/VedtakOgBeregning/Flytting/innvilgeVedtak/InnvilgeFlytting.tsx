import React from 'react';

import { Beregningsresultat } from './Beregningsresultat';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { InnvilgelseFlytting } from '../../../../../typer/vedtak/vedtakFlytting';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { InnvilgeVedtak } from '../../Felles/InnvilgeVedtak';

export const InnvilgeFlytting: React.FC<{
    lagretVedtak?: InnvilgelseFlytting;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}> = ({ lagretVedtak, vedtaksperioderForrigeBehandling }) => {
    const { behandling } = useBehandling();

    return (
        <InnvilgeVedtak
            lagretVedtak={lagretVedtak}
            vedtaksperioderForrigeBehandling={vedtaksperioderForrigeBehandling}
            vedtakUrl={`/api/sak/vedtak/flytting/${behandling.id}`}
            skjulAktivitet
            visBeregningsresultat={(beregningsresultat) => (
                <Beregningsresultat beregningsresultat={beregningsresultat} />
            )}
        />
    );
};
