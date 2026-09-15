import React, { FC } from 'react';

import { VStack } from '@navikt/ds-react';

import { ReiseKort } from './ReiseKort';
import {
    SorterKjørelisteKnapp,
    Sorteringsretning,
    sorterReisevurderinger,
} from './SorterKjørelisteKnapp';
import { KjørelisteProvider } from '../../../context/KjørelisteContext';
import { useReisevurderingPrivatBil } from '../../../hooks/useReisevurderingPrivatBil';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { LokalFeil } from '../../../komponenter/Feil/LokalFeil';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { ReisevurderingPrivatBil } from '../../../typer/kjøreliste';
import { VedtakDagligReise } from '../../../typer/vedtak/vedtakDagligReise';

export const KjørelisteFane: FC = () => {
    const { vedtak } = useVedtak<VedtakDagligReise>();
    const { reisevurderingerResponse } = useReisevurderingPrivatBil();

    return (
        <DataViewer response={{ vedtak, reisevurderingerResponse }} type={'reisedata'}>
            {({ vedtak, reisevurderingerResponse }) => (
                <KjørelisteProvider vedtak={vedtak}>
                    <LokalFeil>
                        <FaneInnhold reisevurderingerResponse={reisevurderingerResponse} />
                    </LokalFeil>
                </KjørelisteProvider>
            )}
        </DataViewer>
    );
};

const FaneInnhold: React.FC<{ reisevurderingerResponse: ReisevurderingPrivatBil[] }> = ({
    reisevurderingerResponse,
}) => {
    const [reisevurderinger, settReisevurderinger] = React.useState(reisevurderingerResponse);
    const [sortering, settSortering] = React.useState<Sorteringsretning>('nyest');

    const sorterteReisevurderinger = React.useMemo(
        () => sorterReisevurderinger(reisevurderinger, sortering),
        [reisevurderinger, sortering]
    );

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
            {sorterteReisevurderinger.length > 1 && (
                <SorterKjørelisteKnapp sortering={sortering} settSortering={settSortering} />
            )}

            {sorterteReisevurderinger.map((reise) => (
                <ReiseKort
                    key={reise.reiseId}
                    reisevurdering={reise}
                    oppdaterReisevurdering={(oppdatertReisevurdering: ReisevurderingPrivatBil) =>
                        oppdaterReisevurderinger(reise.reiseId, oppdatertReisevurdering)
                    }
                />
            ))}
            <StegKnapp steg={Steg.KJØRELISTE}>Ferdigstill steg</StegKnapp>
        </VStack>
    );
};
