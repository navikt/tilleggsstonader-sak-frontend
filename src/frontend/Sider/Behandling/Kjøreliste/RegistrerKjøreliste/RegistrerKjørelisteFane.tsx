import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { RegistrerKjørelisteReiseKort } from './RegistrerKjørelisteReiseKort';
import { KjørelisteProvider } from '../../../../context/KjørelisteContext';
import { useRegistrertKjørtDag } from '../../../../hooks/useRegistrertKjørtDag';
import { useReisevurderingPrivatBil } from '../../../../hooks/useReisevurderingPrivatBil';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../typer/behandling/steg';
import {
    RegistrertKjørtUke,
    RegistrertKjørtUkePostRequest,
    RegistrertKjørtUkePutRequest,
    ReisevurderingPrivatBil,
} from '../../../../typer/kjøreliste';
import { Ressurs } from '../../../../typer/ressurs';
import { VedtakDagligReise } from '../../../../typer/vedtak/vedtakDagligReise';

export const RegistrerKjørelisteFane: React.FC = () => {
    const { vedtak } = useVedtak<VedtakDagligReise>();
    const { reisevurderingerResponse } = useReisevurderingPrivatBil();
    const { registrertKjørtUker, lagreUke, oppdaterUke } = useRegistrertKjørtDag();

    return (
        <DataViewer
            response={{ vedtak, reisevurderingerResponse, registrertKjørtUker }}
            type={'reisedata'}
        >
            {({ vedtak, reisevurderingerResponse, registrertKjørtUker }) => (
                <KjørelisteProvider vedtak={vedtak}>
                    <FaneInnhold
                        reisevurderingerResponse={reisevurderingerResponse}
                        registrertKjørtUker={registrertKjørtUker}
                        lagreUke={lagreUke}
                        oppdaterUke={oppdaterUke}
                    />
                </KjørelisteProvider>
            )}
        </DataViewer>
    );
};

const FaneInnhold: React.FC<{
    reisevurderingerResponse: ReisevurderingPrivatBil[];
    registrertKjørtUker: RegistrertKjørtUke[];
    lagreUke: (req: RegistrertKjørtUkePostRequest) => Promise<Ressurs<RegistrertKjørtUke>>;
    oppdaterUke: (
        ukeId: string,
        req: RegistrertKjørtUkePutRequest
    ) => Promise<Ressurs<RegistrertKjørtUke>>;
}> = ({ reisevurderingerResponse, registrertKjørtUker, lagreUke, oppdaterUke }) => {
    const [reisevurderinger, settReisevurderinger] = useState(reisevurderingerResponse);

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
                <RegistrerKjørelisteReiseKort
                    key={reise.reiseId}
                    reisevurdering={reise}
                    oppdaterReisevurdering={(oppdatertReisevurdering: ReisevurderingPrivatBil) =>
                        oppdaterReisevurderinger(reise.reiseId, oppdatertReisevurdering)
                    }
                    registrertKjørtUker={registrertKjørtUker}
                    lagreUke={lagreUke}
                    oppdaterUke={oppdaterUke}
                />
            ))}
            <StegKnapp steg={Steg.REGISTRER_KJØRELISTE}>Ferdigstill steg</StegKnapp>
        </VStack>
    );
};
