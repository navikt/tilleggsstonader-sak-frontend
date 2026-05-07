import React, { FC, useState } from 'react';

import { CalculatorIcon } from '@navikt/aksel-icons';
import { Heading, HStack, Switch, VStack } from '@navikt/ds-react';

import { DagligReisePrivatBilBeregningsresultatTabell } from './DagligReisePrivatBilBeregningsresultatTabell';
import { PrivatBilOppsummertBeregning } from './typer';
import { useOppsummertBeregningPrivatBil } from '../../../../../hooks/useOppsummertBeregningPrivatBil';
import DataViewer from '../../../../../komponenter/DataViewer';
import Panel from '../../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { FanePath } from '../../../faner';

export const BeregningFaneDagligReise: FC = () => {
    const { oppsummertBeregningResponse } = useOppsummertBeregningPrivatBil();

    return (
        <VStack gap="space-24">
            <DataViewer type={'beregningsresultat'} response={{ oppsummertBeregningResponse }}>
                {({ oppsummertBeregningResponse }) => (
                    <Beregning oppsummertBeregning={oppsummertBeregningResponse} />
                )}
            </DataViewer>
            <StegKnapp steg={Steg.BEREGNING} nesteFane={FanePath.SIMULERING}>
                Ferdigstill steg
            </StegKnapp>
        </VStack>
    );
};

const Beregning: FC<{ oppsummertBeregning: PrivatBilOppsummertBeregning }> = ({
    oppsummertBeregning,
}) => {
    const [visTidligerePerioder, setVisTidligerePerioder] = useState(false);

    const harPerioderFraTidligereVedtak = oppsummertBeregning.reiser.some((reise) =>
        reise.perioder.some((periode) => periode.fraTidligereVedtak)
    );

    return (
        <Panel ikon={<CalculatorIcon />} tittel="Beregningsresultat inkludert kjøreliste">
            <VStack gap="space-16">
                <HStack justify="space-between">
                    <Heading spacing size="xsmall" level="4">
                        Beregningsresultat
                    </Heading>
                    {harPerioderFraTidligereVedtak && (
                        <Switch
                            position="left"
                            size="small"
                            checked={visTidligerePerioder}
                            onChange={() => setVisTidligerePerioder((prev) => !prev)}
                        >
                            Vis upåvirkede perioder
                        </Switch>
                    )}
                </HStack>
                {oppsummertBeregning.reiser.map((reise) => {
                    const relevantePerioder = reise.perioder.filter(
                        (periode) => visTidligerePerioder || !periode.fraTidligereVedtak
                    );
                    if (relevantePerioder.length === 0) {
                        return null;
                    }
                    const totaltStønadsbeløp = visTidligerePerioder
                        ? reise.totaltStønadsbeløpMedPerioderFraForrigeVedtak
                        : reise.totaltStønadsbeløpUtenPerioderFraForrigeVedtak;
                    return (
                        <DagligReisePrivatBilBeregningsresultatTabell
                            key={reise.reiseId}
                            oppsummertBeregning={{
                                ...reise,
                                perioder: relevantePerioder,
                                totaltStønadsbeløp,
                            }}
                        />
                    );
                })}
            </VStack>
        </Panel>
    );
};
