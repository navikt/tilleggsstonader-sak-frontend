import React, { FC } from 'react';

import { VStack } from '@navikt/ds-react';

import { useKjøreliste } from '../../../hooks/useKjøreliste';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { InnvilgelseDagligReise } from '../../../typer/vedtak/vedtakDagligReise';
import { FanePath } from '../faner';
import { ReiseKort } from './ReiseKort';

export const KjørelisteFane: FC = () => {
    const { vedtak } = useVedtak<InnvilgelseDagligReise>();
    const { kjørelister } = useKjøreliste();

    return (
        <DataViewer response={{ vedtak, kjørelister }} type={'reisedata'}>
            {({ vedtak, kjørelister }) => (
                <VStack gap="space-24">
                    {vedtak.rammevedtakPrivatBil &&
                        vedtak.rammevedtakPrivatBil?.reiser.map((reise) => (
                            <ReiseKort
                                key={reise.reiseId}
                                rammeForReise={reise}
                                reisevurderinger={kjørelister}
                            />
                        ))}
                    <StegKnapp steg={Steg.KJØRELISTE} nesteFane={FanePath.BEREGNING}>
                        Ferdigstill steg
                    </StegKnapp>
                </VStack>
            )}
        </DataViewer>
    );
};
