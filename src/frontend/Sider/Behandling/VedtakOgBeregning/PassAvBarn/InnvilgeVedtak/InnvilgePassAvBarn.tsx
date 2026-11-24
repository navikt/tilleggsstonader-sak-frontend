import React from 'react';

import { Beregningsresultat } from './Beregningsresultat';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { RegelverkKontekstmeny } from '../../../../../komponenter/VilkårPanel/RegelverkKontekstmeny';
import { InnvilgelsePassAvBarn } from '../../../../../typer/vedtak/vedtakPassAvBarn';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { lenkerForskriftBeregningPassAvBarn } from '../../../lenker';
import { InnvilgeVedtak } from '../../Felles/InnvilgeVedtak';

interface Props {
    lagretVedtak?: InnvilgelsePassAvBarn;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}

export const InnvilgePassAvBarn: React.FC<Props> = ({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
}) => {
    const { behandling } = useBehandling();

    return (
        <InnvilgeVedtak
            lagretVedtak={lagretVedtak}
            vedtaksperioderForrigeBehandling={vedtaksperioderForrigeBehandling}
            vedtakUrl={`/api/sak/vedtak/tilsyn-barn/${behandling.id}`}
            panelTittel="Beregning"
            kontekstmeny={
                <RegelverkKontekstmeny forskriftlenker={lenkerForskriftBeregningPassAvBarn} />
            }
            visBeregningsresultat={(beregningsresultat) => (
                <Beregningsresultat beregningsresultat={beregningsresultat} />
            )}
            tidligsteEndring={(beregningsresultat) => beregningsresultat.tidligsteEndring}
        />
    );
};
