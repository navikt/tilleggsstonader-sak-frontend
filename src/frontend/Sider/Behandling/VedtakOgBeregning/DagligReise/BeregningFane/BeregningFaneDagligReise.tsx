import React, { FC } from 'react';

import { CalculatorIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

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
    return (
        <Panel ikon={<CalculatorIcon />} tittel="Beregningsresultat inkludert kjøreliste">
            <VStack gap="space-16">
                {oppsummertBeregning.reiser.map((reise) => (
                    <DagligReisePrivatBilBeregningsresultatTabell
                        key={reise.reiseId}
                        oppsummertBeregning={reise}
                    />
                ))}
            </VStack>
        </Panel>
    );
};
