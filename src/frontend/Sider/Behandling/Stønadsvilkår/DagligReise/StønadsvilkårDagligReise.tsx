import React from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { NyttVilkårDagligReise } from './EndreVilkår/NyttVilkårDagligReise';
import { VisEllerEndreVilkårDagligReise } from './VisEllerEndreVilkårDagligReise';
import {
    useVilkårDagligReise,
    VilkårDagligReiseProvider,
} from '../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import { useHentVilkårDagligReise } from '../../../../hooks/useHentVilkårsvurdering';
import { useRegelstruktur } from '../../../../hooks/useRegler';
import DataViewer from '../../../../komponenter/DataViewer';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Steg } from '../../../../typer/behandling/steg';
import { FanePath } from '../../faner';

export const StønadsvilkårDagligReise = () => {
    const { regelStruktur } = useRegelstruktur();
    const { eksisterendeVilkår } = useHentVilkårDagligReise();

    return (
        <VStack gap="4">
            <DataViewer type="vilkår" response={{ eksisterendeVilkår, regelStruktur }}>
                {({ eksisterendeVilkår, regelStruktur }) => (
                    <VilkårDagligReiseProvider
                        eksisterendeVilkår={eksisterendeVilkår}
                        regelstruktur={regelStruktur}
                    >
                        <StønadsvilkårInnhold />
                    </VilkårDagligReiseProvider>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.VILKÅR} nesteFane={FanePath.VEDTAK_OG_BEREGNING}>
                Fullfør vilkårsvurdering og gå videre
            </StegKnapp>
        </VStack>
    );
};

const StønadsvilkårInnhold = () => {
    const { vilkårsett } = useVilkårDagligReise();

    return (
        <VilkårPanel tittel={'Daglig Reise'} ikon={<BriefcaseIcon />}>
            {vilkårsett.map((vilkår) => (
                <VisEllerEndreVilkårDagligReise key={vilkår.id} vilkår={vilkår} />
            ))}

            <NyttVilkårDagligReise />
        </VilkårPanel>
    );
};
