import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { Beregningsresultat } from './Beregningsresultat';
import { Vedtaksperioder } from './Vedtaksperioder';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { useStønadsperioder } from '../../../../../hooks/useStønadsperioder';
import DataViewer from '../../../../../komponenter/DataViewer';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import Panel from '../../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { byggTomRessurs, byggHenterRessurs } from '../../../../../typer/ressurs';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    BeregningsresultatLæremidler,
    InnvilgelseLæremidler,
    InnvilgelseLæremidlerRequest,
} from '../../../../../typer/vedtak/vedtakLæremidler';
import { Periode } from '../../../../../utils/periode';
import { FanePath } from '../../../faner';
import { StønadsperiodeListe } from '../../../Stønadsvilkår/OppsummeringStønadsperioder';
import { initialiserVedtaksperioder } from '../vedtakLæremidlerUtils';

export const InnvilgeLæremidler: React.FC<{
    lagretVedtak: InnvilgelseLæremidler | undefined;
}> = ({ lagretVedtak }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const { stønadsperioder } = useStønadsperioder(behandling.id);

    const [vedtaksperioder, settVedtaksperioder] = useState<Periode[]>(
        initialiserVedtaksperioder(lagretVedtak)
    );

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatLæremidler>());

    const lagreVedtak = () => {
        return request<null, InnvilgelseLæremidlerRequest>(
            `/api/sak/vedtak/laremidler/${behandling.id}/innvilgelse`,
            'POST',
            { type: TypeVedtak.INNVILGELSE, vedtaksperioder: vedtaksperioder }
        );
    };

    const beregnLæremidler = () => {
        settBeregningsresultat(byggHenterRessurs());

        request<BeregningsresultatLæremidler, Periode[]>(
            `/api/sak/vedtak/laremidler/${behandling.id}/beregn`,
            'POST',
            vedtaksperioder
        ).then(settBeregningsresultat);
    };

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
                <Vedtaksperioder
                    vedtaksperioder={vedtaksperioder}
                    settVedtaksperioder={settVedtaksperioder}
                />
                {erStegRedigerbart && <SmallButton onClick={beregnLæremidler}>Beregn</SmallButton>}
                <VStack gap="8">
                    {erStegRedigerbart && (
                        <DataViewer response={{ beregningsresultat }}>
                            {({ beregningsresultat }) => (
                                <Beregningsresultat beregningsresultat={beregningsresultat} />
                            )}
                        </DataViewer>
                    )}
                    {!erStegRedigerbart && lagretVedtak?.beregningsresultat && (
                        <Beregningsresultat beregningsresultat={lagretVedtak.beregningsresultat} />
                    )}
                </VStack>
            </Panel>
            <StegKnapp
                steg={Steg.BEREGNE_YTELSE}
                nesteFane={FanePath.SIMULERING}
                onNesteSteg={lagreVedtak}
            >
                Lagre vedtak og gå videre
            </StegKnapp>
        </>
    );
};
