import React, { useEffect, useId } from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Heading, VStack } from '@navikt/ds-react';

import { NyttVilkårReiseOppstartAvslutningHjemreise } from './EndreVilkår/NyttVilkårReiseOppstartAvslutningHjemreise';
import { finnAktivitetIdForFakta } from './typer/faktaReiseOppstartAvslutningHjemreise';
import { VisEllerEndreVilkårReiseOppstartAvslutningHjemreise } from './VisEllerEndreVilkårReiseOppstartAvslutningHjemreise';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import {
    useVilkårReiseOppstartAvslutningHjemreise,
    VilkårReiseOppstartAvslutningHjemreiseProvider,
} from '../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import { useHentVilkårReiseOppstartAvslutningHjemreise } from '../../../../hooks/useHentVilkårsvurdering';
import { useRegelstrukturReiseOppstartAvslutningHjemreise } from '../../../../hooks/useRegler';
import { useVilkårperioder } from '../../../../hooks/useVilkårperioder';
import DataViewer from '../../../../komponenter/DataViewer';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Steg } from '../../../../typer/behandling/steg';
import { formaterIsoPeriode } from '../../../../utils/dato';
import {
    Aktivitet,
    AktivitetTypeTilTekst,
} from '../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { VilkårPeriodeResultat } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

export const StønadsvilkårReiseOppstartAvslutningHjemreise: React.FC = () => {
    const { behandling } = useBehandling();
    const { regelStruktur } = useRegelstrukturReiseOppstartAvslutningHjemreise();
    const { eksisterendeVilkår } = useHentVilkårReiseOppstartAvslutningHjemreise();
    const { vilkårperioderResponse } = useVilkårperioder(behandling.id);

    return (
        <VStack gap="space-16">
            <DataViewer
                type="vilkår"
                response={{ eksisterendeVilkår, regelStruktur, vilkårperioderResponse }}
            >
                {({ eksisterendeVilkår, regelStruktur, vilkårperioderResponse }) => (
                    <VilkårReiseOppstartAvslutningHjemreiseProvider
                        eksisterendeVilkår={eksisterendeVilkår}
                        regelstruktur={regelStruktur}
                        aktiviteter={vilkårperioderResponse.vilkårperioder.aktiviteter}
                    >
                        <StønadsvilkårInnhold />
                    </VilkårReiseOppstartAvslutningHjemreiseProvider>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.VILKÅR}>Fullfør vilkårsvurdering og gå videre</StegKnapp>
        </VStack>
    );
};

const StønadsvilkårInnhold = () => {
    const { vilkårsett, aktiviteter } = useVilkårReiseOppstartAvslutningHjemreise();
    const { settUlagretKomponent, nullstillUlagretKomponent } = useApp();

    const [redigererId, settRedigererId] = React.useState<string | undefined>(undefined);

    const komponentId = useId();

    useEffect(() => {
        if (redigererId !== undefined) {
            settUlagretKomponent(komponentId);
        } else {
            nullstillUlagretKomponent(komponentId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redigererId]);

    const startRedigering = (id: string) => {
        if (redigererId !== undefined) {
            return false;
        }
        settRedigererId(id);
        return true;
    };

    const avsluttRedigering = () => {
        settRedigererId(undefined);
    };

    const aktiviteterSortert = [...aktiviteter].sort((a, b) => a.fom.localeCompare(b.fom));

    return (
        <VilkårPanel tittel={'Oppstart, avslutning og hjemreiser'} ikon={<BriefcaseIcon />}>
            <VStack gap="space-16">
                {aktiviteterSortert.length === 0 && (
                    <BodyShort>
                        Det finnes ingen aktiviteter å knytte reiser til. Legg til en aktivitet
                        under inngangsvilkår.
                    </BodyShort>
                )}
                {aktiviteterSortert.map((aktivitet: Aktivitet) => {
                    const reiserForAktivitet = vilkårsett.filter(
                        (vilkår) => finnAktivitetIdForFakta(vilkår.fakta) === aktivitet.globalId
                    );
                    const nyttVilkårId = `nytt-${aktivitet.globalId}`;

                    return (
                        <Box
                            key={aktivitet.globalId}
                            background="default"
                            borderColor="neutral-subtle"
                            borderRadius="12"
                            borderWidth="1"
                            padding="space-16"
                        >
                            <VStack gap="space-12">
                                <Heading size="xsmall" level="3">
                                    {AktivitetTypeTilTekst[aktivitet.type]} (
                                    {formaterIsoPeriode(aktivitet.fom, aktivitet.tom)})
                                </Heading>
                                {reiserForAktivitet.map((vilkår) => (
                                    <VisEllerEndreVilkårReiseOppstartAvslutningHjemreise
                                        key={vilkår.id}
                                        vilkår={vilkår}
                                        aktivitet={aktivitet}
                                        redigerer={redigererId === vilkår.id}
                                        redigererAnnetVilkår={
                                            redigererId !== undefined && redigererId !== vilkår.id
                                        }
                                        startRedigering={() => startRedigering(vilkår.id)}
                                        avsluttRedigering={avsluttRedigering}
                                    />
                                ))}
                                {aktivitet.resultat === VilkårPeriodeResultat.OPPFYLT && (
                                    <NyttVilkårReiseOppstartAvslutningHjemreise
                                        aktivitet={aktivitet}
                                        leggerTilNyttVilkår={redigererId === nyttVilkårId}
                                        startRedigering={() => startRedigering(nyttVilkårId)}
                                        avsluttRedigering={avsluttRedigering}
                                    />
                                )}
                            </VStack>
                        </Box>
                    );
                })}
            </VStack>
        </VilkårPanel>
    );
};
