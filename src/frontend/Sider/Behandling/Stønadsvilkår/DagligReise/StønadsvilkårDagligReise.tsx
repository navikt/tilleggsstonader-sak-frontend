import React, { useEffect, useId } from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';
import { Alert, VStack } from '@navikt/ds-react';

import { KopierVilkårDagligReise } from './EndreVilkår/KopierVilkårDagligReise';
import { NyttVilkårDagligReise } from './EndreVilkår/NyttVilkårDagligReise';
import { erFaktaPrivatBil } from './typer/faktaDagligReise';
import { VilkårDagligReise } from './typer/vilkårDagligReise';
import { VisEllerEndreVilkårDagligReise } from './VisEllerEndreVilkårDagligReise';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import {
    useVilkårDagligReise,
    VilkårDagligReiseProvider,
} from '../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import { useHentVilkårDagligReise } from '../../../../hooks/useHentVilkårsvurdering';
import { useRegelstruktur } from '../../../../hooks/useRegler';
import { useVilkårperioder } from '../../../../hooks/useVilkårperioder';
import DataViewer from '../../../../komponenter/DataViewer';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Steg } from '../../../../typer/behandling/steg';
import { Aktivitet } from '../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { erAktivitetDagligReiseTso } from '../../Inngangsvilkår/typer/vilkårperiode/aktivitetDagligReiseTso';
import { erAktivitetDagligReiseTsr } from '../../Inngangsvilkår/typer/vilkårperiode/aktivitetDagligReiseTsr';

function totaltAntallReisedagerIStønadsvilkår(vilkårsett: VilkårDagligReise[]): number {
    return vilkårsett
        .map((vilkår) => vilkår.fakta)
        .filter(erFaktaPrivatBil)
        .reduce(
            (acc, fakta) =>
                acc +
                fakta.faktaDelperioder.reduce(
                    (sum, delperiode) => sum + (delperiode?.reisedagerPerUke || 0),
                    0
                ),
            0
        );
}

function totaltAntallReisedagerIAktivitetsperioder(aktiviteter: Aktivitet[]): number {
    return aktiviteter
        .filter(
            (aktivitet) =>
                erAktivitetDagligReiseTso(aktivitet) || erAktivitetDagligReiseTsr(aktivitet)
        )
        .reduce((acc, aktivitet) => acc + (aktivitet.faktaOgVurderinger.aktivitetsdager || 0), 0);
}

export const StønadsvilkårDagligReise = () => {
    const { behandling } = useBehandling();
    const { regelStruktur } = useRegelstruktur();
    const { eksisterendeVilkår } = useHentVilkårDagligReise();
    const { vilkårperioderResponse } = useVilkårperioder(behandling.id);

    return (
        <VStack gap="space-16">
            <DataViewer
                type="vilkår"
                response={{ eksisterendeVilkår, regelStruktur, vilkårperioderResponse }}
            >
                {({ eksisterendeVilkår, regelStruktur, vilkårperioderResponse }) => (
                    <VilkårDagligReiseProvider
                        eksisterendeVilkår={eksisterendeVilkår}
                        regelstruktur={regelStruktur}
                        aktiviteter={vilkårperioderResponse.vilkårperioder.aktiviteter}
                    >
                        <StønadsvilkårInnhold />
                    </VilkårDagligReiseProvider>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.VILKÅR}>Fullfør vilkårsvurdering og gå videre</StegKnapp>
        </VStack>
    );
};

const StønadsvilkårInnhold = () => {
    const { vilkårsett, aktiviteter } = useVilkårDagligReise();
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();

    const [vilkårSomKopieres, settVilkårSomKopieres] = React.useState<
        VilkårDagligReise | undefined
    >(undefined);
    const [originalTomForKopiering, settOriginalTomForKopiering] = React.useState<
        string | undefined
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
            settOriginalTomForKopiering(vilkår.tom);
            settVilkårSomKopieres({
                ...vilkår,
                fom: kopidato,
                tom: undefined,
            });
        }
    };

    const avsluttKopiering = () => {
        settVilkårSomKopieres(undefined);
        settOriginalTomForKopiering(undefined);
        avsluttRedigering();
    };

    const skalViseAdvarselOmAntallReisedager =
        totaltAntallReisedagerIStønadsvilkår(vilkårsett) >
        totaltAntallReisedagerIAktivitetsperioder(aktiviteter);

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
                            avsluttKopiering={avsluttKopiering}
                            tomFraVilkårSomKopieres={originalTomForKopiering}
                        />
                    )}
                </React.Fragment>
            ))}

            {skalViseAdvarselOmAntallReisedager && (
                <Alert variant="warning" size="small">
                    Antall reisedager er høyere enn antall aktivitetsdager.
                </Alert>
            )}
            <NyttVilkårDagligReise
                leggerTilNyttVilkår={redigererVilkårId === 'nytt'}
                startRedigering={() => startRedigering('nytt')}
                avsluttRedigering={avsluttRedigering}
            />
        </VilkårPanel>
    );
};
