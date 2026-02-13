import React, { useEffect, useId } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { BriefcaseIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { KopierVilkårDagligReise } from './EndreVilkår/KopierVilkårDagligReise';
import { NyttVilkårDagligReise } from './EndreVilkår/NyttVilkårDagligReise';
import { VilkårDagligReise } from './typer/vilkårDagligReise';
import { VisEllerEndreVilkårDagligReise } from './VisEllerEndreVilkårDagligReise';
import { useApp } from '../../../../context/AppContext';
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
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();

    const [vilkårSomKopieres, settVilkårSomKopieres] = React.useState<
        VilkårDagligReise | undefined
    >(undefined);
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

    const startKopiering = (vilkår: VilkårDagligReise, kopidato: string) => {
        if (startRedigering(`kopi-${vilkår.id}`)) {
            settVilkårSomKopieres({
                ...vilkår,
                fom: kopidato,
                tom: undefined,
            });
        }
    };

    const avsluttKopiering = () => {
        settVilkårSomKopieres(undefined);
        avsluttRedigering();
    };

    return (
        <VilkårPanel tittel={'Daglige reiser'} ikon={<BriefcaseIcon />}>
            {vilkårsett.map((vilkår) => (
                <React.Fragment key={vilkår.id}>
                    <VisEllerEndreVilkårDagligReise
                        vilkår={vilkår}
                        redigerer={redigererVilkårId === vilkår.id}
                        redigererAnnetVilkår={
                            redigererVilkårId !== undefined && redigererVilkårId !== vilkår.id
                        }
                        startRedigering={() => startRedigering(vilkår.id)}
                        avsluttRedigering={avsluttRedigering}
                        startKopiering={startKopiering}
                    />
                    {vilkårSomKopieres && vilkårSomKopieres.id === vilkår.id && (
                        <KopierVilkårDagligReise
                            kopierFra={vilkårSomKopieres}
                            etterVilkårId={vilkår.id}
                            avsluttKopiering={avsluttKopiering}
                        />
                    )}
                </React.Fragment>
            ))}

            <NyttVilkårDagligReise
                leggerTilNyttVilkår={redigererVilkårId === 'nytt'}
                startRedigering={() => startRedigering('nytt')}
                avsluttRedigering={avsluttRedigering}
            />
        </VilkårPanel>
    );
};
