import React, { useEffect, useId } from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { NyttVilkårReiseTilSamling } from './EndreVilkår/NyttVilkårReiseTilSamling';
import { VisEllerEndreVilkårReiseTilSamling } from './VisEllerEndreVilkårReiseTilSamling';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import {
    useVilkårReiseTilSamling,
    VilkårReiseTilSamlingProvider,
} from '../../../../context/VilkårReiseTilSamlingContext/VilkårReiseTilSamlingContext';
import { useHentVilkårReiseTilSamling } from '../../../../hooks/useHentVilkårsvurdering';
import { useRegelstrukturReiseTilSamling } from '../../../../hooks/useRegler';
import { useVilkårperioder } from '../../../../hooks/useVilkårperioder';
import DataViewer from '../../../../komponenter/DataViewer';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Steg } from '../../../../typer/behandling/steg';

export const StønadsvilkårReiseTilSamling: React.FC = () => {
    const { behandling } = useBehandling();
    const { regelStruktur } = useRegelstrukturReiseTilSamling();
    const { eksisterendeVilkår } = useHentVilkårReiseTilSamling();
    const { vilkårperioderResponse } = useVilkårperioder(behandling.id);

    return (
        <VStack gap="space-16">
            <DataViewer
                type="vilkår"
                response={{ eksisterendeVilkår, regelStruktur, vilkårperioderResponse }}
            >
                {({ eksisterendeVilkår, regelStruktur, vilkårperioderResponse }) => (
                    <VilkårReiseTilSamlingProvider
                        eksisterendeVilkår={eksisterendeVilkår}
                        regelstruktur={regelStruktur}
                        aktiviteter={vilkårperioderResponse.vilkårperioder.aktiviteter}
                    >
                        <StønadsvilkårInnhold />
                    </VilkårReiseTilSamlingProvider>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.VILKÅR}>Fullfør vilkårsvurdering og gå videre</StegKnapp>
        </VStack>
    );
};

const StønadsvilkårInnhold = () => {
    const { vilkårsett } = useVilkårReiseTilSamling();
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();

    const [redigererVilkårId, settRedigererVilkårId] = React.useState<string | 'nytt' | undefined>(
        undefined
    );

    const komponentId = useId();

    useEffect(() => {
        if (redigererVilkårId !== undefined) {
            settUlagretKomponent(komponentId);
        } else {
            nullstillUlagretKomponent(komponentId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redigererVilkårId]);

    const startRedigering = (vilkårId: string | 'nytt') => {
        if (redigererVilkårId !== undefined) {
            return false;
        }
        settRedigererVilkårId(vilkårId);
        return true;
    };

    const avsluttRedigering = () => {
        settRedigererVilkårId(undefined);
    };

    return (
        <VilkårPanel tittel={'Reise til samling'} ikon={<BriefcaseIcon />}>
            {vilkårsett.map((vilkår) => (
                <React.Fragment key={vilkår.id}>
                    <VisEllerEndreVilkårReiseTilSamling
                        vilkår={vilkår}
                        redigerer={redigererVilkårId === vilkår.id}
                        redigererAnnetVilkår={
                            redigererVilkårId !== undefined && redigererVilkårId !== vilkår.id
                        }
                        startRedigering={() => startRedigering(vilkår.id)}
                        avsluttRedigering={avsluttRedigering}
                    />
                </React.Fragment>
            ))}
            <NyttVilkårReiseTilSamling
                leggerTilNyttVilkår={redigererVilkårId === 'nytt'}
                startRedigering={() => startRedigering('nytt')}
                avsluttRedigering={avsluttRedigering}
            />
        </VilkårPanel>
    );
};
