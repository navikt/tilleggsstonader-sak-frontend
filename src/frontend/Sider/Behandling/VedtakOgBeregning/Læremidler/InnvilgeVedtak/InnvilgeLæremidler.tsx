import React from 'react';

import { useBehandling } from '../../../../../context/BehandlingContext';
import { useStønadsperioder } from '../../../../../hooks/useStønadsperioder';
import DataViewer from '../../../../../komponenter/DataViewer';
import Panel from '../../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { FanePath } from '../../../faner';
import { StønadsperiodeListe } from '../../../Stønadsvilkår/OppsummeringStønadsperioder';

export const InnvilgeLæremidler: React.FC<> = () => {
    const { behandling } = useBehandling();

    const { stønadsperioder } = useStønadsperioder(behandling.id);

    return (
        <>
            <Panel tittel="Beregning og vedtaksperiode">
                <DataViewer response={{ stønadsperioder }}>
                    {({ stønadsperioder }) => (
                        <StønadsperiodeListe
                            stønadsperioder={stønadsperioder}
                            tittel="Periode hvor bruker er i aktivitet og målgruppe"
                        />
                    )}
                </DataViewer>
            </Panel>
            <StegKnapp
                steg={Steg.BEREGNE_YTELSE}
                nesteFane={FanePath.SIMULERING}
                // onNesteSteg={lagreVedtak}
            >
                Lagre vedtak og gå videre
            </StegKnapp>
        </>
    );
};
