import React, { useState } from 'react';

import { BriefcaseIcon, PlusIcon } from '@navikt/aksel-icons';
import { LocalAlert, VStack } from '@navikt/ds-react';

import { FlyttingSkjema } from './FlyttingSkjema';
import { FlyttingLesevisning } from './LesevisningFlytting';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import {
    useVilkårFlytting,
    VilkårFlyttingProvider,
} from '../../../../context/VilkårFlyttingContext';
import { useHentVilkårFlytting } from '../../../../hooks/useHentVilkårsvurdering';
import { useRegelstrukturFlytting } from '../../../../hooks/useRegler';
import DataViewer from '../../../../komponenter/DataViewer';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Steg } from '../../../../typer/behandling/steg';
import { formaterNullablePeriode } from '../../../../utils/dato';

export const StønadsvilkårFlytting: React.FC = () => {
    const { eksisterendeVilkår } = useHentVilkårFlytting();
    const { regelStruktur } = useRegelstrukturFlytting();

    return (
        <VStack gap="space-16">
            <DataViewer type="vilkår" response={{ eksisterendeVilkår, regelStruktur }}>
                {({ eksisterendeVilkår, regelStruktur }) => (
                    <VilkårFlyttingProvider
                        eksisterendeVilkår={eksisterendeVilkår}
                        regelstruktur={regelStruktur}
                    >
                        <Innhold />
                    </VilkårFlyttingProvider>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.VILKÅR}>Fullfør vilkårsvurdering og gå videre</StegKnapp>
        </VStack>
    );
};

const Innhold: React.FC = () => {
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { vilkårsett, lagreNyttVilkår, oppdaterVilkår } = useVilkårFlytting();
    const [redigererId, settRedigererId] = useState<string>();

    return (
        <VilkårPanel tittel="Flytting" ikon={<BriefcaseIcon />}>
            <VStack gap="space-16">
                {vilkårsett.map((vilkår) => (
                    <section
                        key={vilkår.id}
                        aria-label={`Flyttevilkår ${formaterNullablePeriode(vilkår.fom, vilkår.tom)}`}
                    >
                        {redigererId === vilkår.id ? (
                            <FlyttingSkjema
                                vilkår={vilkår}
                                avbryt={() => settRedigererId(undefined)}
                                lagre={(payload) => oppdaterVilkår(vilkår.id, payload)}
                            />
                        ) : (
                            <FlyttingLesevisning
                                vilkår={vilkår}
                                behandlingId={behandling.id}
                                kanRedigere={erStegRedigerbart && redigererId === undefined}
                                startRedigering={() => settRedigererId(vilkår.id)}
                            />
                        )}
                    </section>
                ))}
                {redigererId === 'ny' && (
                    <FlyttingSkjema
                        avbryt={() => settRedigererId(undefined)}
                        lagre={lagreNyttVilkår}
                    />
                )}
                {erStegRedigerbart && redigererId === undefined && (
                    <SmallButton
                        variant="secondary"
                        icon={<PlusIcon aria-hidden />}
                        onClick={() => settRedigererId('ny')}
                    >
                        Legg til flyttevilkår
                    </SmallButton>
                )}
                {vilkårsett.length === 0 && !erStegRedigerbart && (
                    <LocalAlert status="announcement">
                        <LocalAlert.Header>
                            <LocalAlert.Title>Ingen flyttevilkår registrert</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            Det er ikke registrert flyttevilkår.
                        </LocalAlert.Content>
                    </LocalAlert>
                )}
            </VStack>
        </VilkårPanel>
    );
};
