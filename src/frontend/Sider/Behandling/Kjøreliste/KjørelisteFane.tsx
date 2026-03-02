import React, { FC } from 'react';

import { VStack } from '@navikt/ds-react';

import { useReisevurderingPrivatBil } from '../../../hooks/useKjøreliste';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { InnvilgelseDagligReise } from '../../../typer/vedtak/vedtakDagligReise';
import { FanePath } from '../faner';
import { ReiseKort } from './ReiseKort';
import { ReisevurderingPrivatBil } from '../../../typer/kjøreliste';

export const KjørelisteFane: FC = () => {
    const { vedtak } = useVedtak<InnvilgelseDagligReise>();
    const { reisevurderingerResponse } = useReisevurderingPrivatBil();

    return (
        <DataViewer response={{ vedtak, reisevurderingerResponse }} type={'reisedata'}>
            {({ reisevurderingerResponse }) => (
                <FaneInnhold reisevurderingerResponse={reisevurderingerResponse} />
            )}
        </DataViewer>
    );
};

const FaneInnhold: React.FC<{ reisevurderingerResponse: ReisevurderingPrivatBil[] }> = ({
    reisevurderingerResponse,
}) => {
    const [reisevurderinger, settReisevurderinger] = React.useState(reisevurderingerResponse);

    const oppdaterReisevurderinger = (
        reiseId: string,
        oppdatertReisevurdering: ReisevurderingPrivatBil
    ) => {
        settReisevurderinger((prev) =>
            prev.map((reise) => (reise.reiseId === reiseId ? oppdatertReisevurdering : reise))
        );
    };

    return (
        <VStack gap="space-24">
            {reisevurderinger.map((reise) => (
                <ReiseKort
                    key={reise.reiseId}
                    reisevurdering={reise}
                    oppdaterReisevurdering={(oppdatertReisevurdering: ReisevurderingPrivatBil) =>
                        oppdaterReisevurderinger(reise.reiseId, oppdatertReisevurdering)
                    }
                />
            ))}
            <StegKnapp steg={Steg.KJØRELISTE} nesteFane={FanePath.BEREGNING}>
                Ferdigstill steg
            </StegKnapp>
        </VStack>
    );
};
