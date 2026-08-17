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
import { formaterIsoPeriode, leggTilDager } from '../../../../utils/dato';
import {
    Aktivitet,
    AktivitetTypeTilTekst,
} from '../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    AktivitetDagligReiseTso,
    erAktivitetDagligReiseTso,
} from '../../Inngangsvilkår/typer/vilkårperiode/aktivitetDagligReiseTso';
import {
    AktivitetDagligReiseTsr,
    erAktivitetDagligReiseTsr,
} from '../../Inngangsvilkår/typer/vilkårperiode/aktivitetDagligReiseTsr';

type AktivitetDagligReise = AktivitetDagligReiseTso | AktivitetDagligReiseTsr;

interface ReisedagerPeriode {
    fom: string;
    tom: string;
    antallReisedager: number;
    relevantAktivitet: AktivitetDagligReise;
}

function finnPerioderMedForMangeReisedager(
    vilkårsett: VilkårDagligReise[],
    aktiviteter: Aktivitet[]
): ReisedagerPeriode[] {
    const relevanteAktiviteter = aktiviteter.filter(
        (a) => erAktivitetDagligReiseTso(a) || erAktivitetDagligReiseTsr(a)
    );

    const alleDelperioder = vilkårsett
        .map((vilkår) => vilkår.fakta)
        .filter(erFaktaPrivatBil)
        .flatMap((fakta) =>
            fakta.faktaDelperioder
                .filter((d) => d.reisedagerPerUke)
                .map((d) => ({ ...d, aktivitetId: fakta.aktivitetId }))
        );

    if (alleDelperioder.length === 0) return [];

    const aktivitetIds = [...new Set(alleDelperioder.map((d) => d.aktivitetId))];

    const perioderMedForMange: ReisedagerPeriode[] = [];

    for (const aktivitetId of aktivitetIds) {
        const delperioder = alleDelperioder.filter((d) => d.aktivitetId === aktivitetId);
        const aktivitet = relevanteAktiviteter.find((a) => a.globalId === aktivitetId);
        if (!aktivitet) {
            // Bør ikke skje, men gjør at vi slipper nullability fremover
            continue;
        }

        const breakpoints = [
            ...new Set([
                ...delperioder.flatMap((d) => [d.fom, leggTilDager(d.tom, 1)]),
                ...[aktivitet.fom, leggTilDager(aktivitet.tom, 1)],
            ]),
        ].sort();

        for (let i = 0; i < breakpoints.length - 1; i++) {
            const segmentFom = breakpoints[i];
            const segmentTom = leggTilDager(breakpoints[i + 1], -1);

            const totalReisedager = delperioder
                .filter((d) => d.fom <= segmentFom && d.tom >= segmentTom)
                .reduce((sum, d) => sum + (d.reisedagerPerUke || 0), 0);

            if (totalReisedager === 0) continue;

            const aktivitetsdager = aktivitet.faktaOgVurderinger.aktivitetsdager ?? 0;

            if (totalReisedager > aktivitetsdager) {
                perioderMedForMange.push({
                    fom: segmentFom,
                    tom: segmentTom,
                    antallReisedager: totalReisedager,
                    relevantAktivitet: aktivitet,
                });
            }
        }
    }

    return perioderMedForMange;
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

    const perioderMedForMangeReisedager = finnPerioderMedForMangeReisedager(
        vilkårsett,
        aktiviteter
    );

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

            {perioderMedForMangeReisedager.length > 0 && (
                <Alert variant="warning" size="small">
                    <VStack gap="space-4">
                        <span>
                            Antall reisedager er høyere enn antall aktivitetsdager i følgende
                            periode(r):
                        </span>
                        {perioderMedForMangeReisedager.map((periode) => (
                            <span key={`${periode.fom}-${periode.tom}`}>
                                {formaterIsoPeriode(periode.fom, periode.tom)}:{' '}
                                {periode.antallReisedager} reisedager.{' '}
                                {`${AktivitetTypeTilTekst[periode.relevantAktivitet.type]} med periode ${formaterIsoPeriode(periode.relevantAktivitet.fom, periode.relevantAktivitet.tom!)} har kun ${periode.relevantAktivitet.faktaOgVurderinger.aktivitetsdager ?? 0} tilgjengelige reisedager`}
                            </span>
                        ))}
                    </VStack>
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
