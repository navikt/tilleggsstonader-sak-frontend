import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { BriefcaseIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { NyttVilkårDagligReise } from './EndreVilkår/NyttVilkårDagligReise';
import { VilkårDagligReise } from './typer/vilkårDagligReise';
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
import { Toggle } from '../../../../utils/toggles';
import { FanePath } from '../../faner';

export const StønadsvilkårDagligReise = () => {
    const { regelStruktur } = useRegelstruktur();
    const { eksisterendeVilkår } = useHentVilkårDagligReise();
    const kanBehandlePrivatBil = useFlag(Toggle.KAN_BEHANDLE_PRIVAT_BIL);

    const nesteFane = kanBehandlePrivatBil ? FanePath.VEDTAK : FanePath.VEDTAK_OG_BEREGNING;

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
            <StegKnapp steg={Steg.VILKÅR} nesteFane={nesteFane}>
                Fullfør vilkårsvurdering og gå videre
            </StegKnapp>
        </VStack>
    );
};

const StønadsvilkårInnhold = () => {
    const { vilkårsett } = useVilkårDagligReise();
    const [vilkårSomKopieres, settVilkårSomKopieres] = React.useState<
        VilkårDagligReise | undefined
    >(undefined);

    const startKopiering = (vilkår: VilkårDagligReise) => {
        settVilkårSomKopieres(vilkår);
    };

    const startSplitting = (vilkår: VilkårDagligReise, splittdato: string) => {
        const vilkårForSplitt: VilkårDagligReise = {
            ...vilkår,
            fom: splittdato,
            tom: vilkår.tom,
        };
        settVilkårSomKopieres(vilkårForSplitt);
    };

    return (
        <VilkårPanel tittel={'Daglige reiser'} ikon={<BriefcaseIcon />}>
            {vilkårsett.map((vilkår) => (
                <VisEllerEndreVilkårDagligReise
                    key={vilkår.id}
                    vilkår={vilkår}
                    startKopiering={startKopiering}
                    startSplitting={startSplitting}
                />
            ))}

            <NyttVilkårDagligReise kopierFra={vilkårSomKopieres} />
        </VilkårPanel>
    );
};
