import React, { FC } from 'react';

import { CalculatorIcon } from '@navikt/aksel-icons';
import { Alert, VStack } from '@navikt/ds-react';

import { BeregningsresultatDagligReisePrivatBil } from './BeregningsresultatDagligReisePrivatBil';
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
        <VStack gap="space-24">
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

    const { beregningsresultat } = vedtak;

    return (
        <Panel ikon={<CalculatorIcon />} tittel="Beregningsresultat inkludert kjøreliste">
            <VStack gap="space-16">
                {beregningsresultat.privatBil ? (
                    <BeregningsresultatDagligReisePrivatBil
                        beregningsresultat={beregningsresultat.privatBil}
                        rammevedtakPrivatBil={vedtak.rammevedtakPrivatBil}
                    />
                ) : (
                    <Alert variant={'error'}>Fant ingen beregningsresultat for privat bil</Alert>
                )}
            </VStack>
        </Panel>
    );
};
