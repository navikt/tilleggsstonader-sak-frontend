import React, { useEffect, useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { BeregningsresultatOffentligTransport } from './BeregningsresultatOffentligTransport';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import DataViewer from '../../../../../komponenter/DataViewer';
import Panel from '../../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { byggHenterRessurs, byggTomRessurs } from '../../../../../typer/ressurs';
import {
    BeregnDagligReiseRequest,
    BeregningsresultatDagligReise,
    InnvilgelseDagligReise,
} from '../../../../../typer/vedtak/vedtakDagligReise';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { FanePath } from '../../../faner';

interface Props {
    lagretVedtak?: InnvilgelseDagligReise;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}

export const BeregningDagligReise: React.FC<Props> = ({ lagretVedtak }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatDagligReise>());

    const hentberegningsresultat = () => {
        settBeregningsresultat(byggHenterRessurs());
        request<BeregningsresultatDagligReise, BeregnDagligReiseRequest>(
            `/api/sak/vedtak/daglig-reise/${behandling.id}/beregningsresultat`,
            'GET'
        ).then((result) => settBeregningsresultat(result));
    };

    const ferdigstill = () => {
        return request(`/api/sak/vedtak/daglig-reise/${behandling.id}/ferdigstill-beregn`, 'PUT');
    };

    useEffect(() => {
        hentberegningsresultat();
    });

    return (
        <>
            <Panel tittel="Beregning offentlig transport">
                <VStack gap={'8'}>
                    {erStegRedigerbart && (
                        <DataViewer type={'beregningsresultat'} response={{ beregningsresultat }}>
                            {({ beregningsresultat }) => (
                                <>
                                    <BeregningsresultatOffentligTransport
                                        beregningsresultat={beregningsresultat}
                                    />
                                </>
                            )}
                        </DataViewer>
                    )}
                    {!erStegRedigerbart && lagretVedtak?.beregningsresultat && (
                        <>
                            <BeregningsresultatOffentligTransport
                                beregningsresultat={lagretVedtak.beregningsresultat}
                            />
                        </>
                    )}
                </VStack>
                <StegKnapp
                    nesteFane={FanePath.SIMULERING}
                    steg={Steg.BEREGNE_YTELSE}
                    onNesteSteg={ferdigstill}
                >
                    Gå videre
                </StegKnapp>
            </Panel>
        </>
    );
};
