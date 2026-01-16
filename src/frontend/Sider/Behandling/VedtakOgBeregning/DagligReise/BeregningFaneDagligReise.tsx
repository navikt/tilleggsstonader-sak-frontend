import React, { FC } from 'react';

import { CalculatorIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { Beregningsresultat } from './innvilgeVedtak/Beregningsresultat';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../typer/behandling/steg';
import { VedtakDagligReise, vedtakErInnvilgelse } from '../../../../typer/vedtak/vedtakDagligReise';
import { FanePath } from '../../faner';

export const BeregningFaneDagligReise: FC = () => {
    const { vedtak } = useVedtak<VedtakDagligReise>();

    return (
        <VStack gap="6">
            <DataViewer type={'vedtak'} response={{ vedtak }}>
                {({ vedtak }) => <Beregning vedtak={vedtak} />}
            </DataViewer>
            <StegKnapp steg={Steg.BEREGNING} nesteFane={FanePath.SIMULERING}>
                Ferdigstill steg
            </StegKnapp>
        </VStack>
    );
};

const Beregning: FC<{ vedtak: VedtakDagligReise }> = ({ vedtak }) => {
    if (!vedtakErInnvilgelse(vedtak)) {
        return null;
    }
    return (
        <Panel ikon={<CalculatorIcon />} tittel="Beregningsresultat">
            <Beregningsresultat beregningsresultat={vedtak.beregningsresultat} />
        </Panel>
    );
};
