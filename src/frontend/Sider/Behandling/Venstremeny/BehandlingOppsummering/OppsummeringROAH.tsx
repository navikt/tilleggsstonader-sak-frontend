import React from 'react';

import { Box, Label, VStack } from '@navikt/ds-react';

import { VilkårOppsummeringRad } from './OppsummeringRad';
import { finnTekstForTypeVilkårFakta } from './oppsummeringUtils';
import { OppsummertVilkår } from '../../../../typer/behandling/behandlingOppsummering';
import { typeReiseformålTilTekst } from '../../Stønadsvilkår/ReiseOppstartAvslutningHjemreise/typer/vilkårReiseOppstartAvslutningHjemreise';

export const OppsummeringROAH: React.FC<{ vilkår: OppsummertVilkår[] }> = ({ vilkår }) => {
    const paraplyvilkår = vilkår
        .filter(
            (vilkår) =>
                vilkår.typeFakta === 'REISE_OPPSTART_AVSLUTNING_HJEMREISE_MIDLERTIDIG_BOSTED'
        )
        .sort((a, b) => (a.fom ?? '').localeCompare(b.fom ?? ''));

    return (
        <VStack gap="space-8">
            <Label size="small">Oppstart, avslutning og hjemreiser</Label>
            {paraplyvilkår.map((paraply) => (
                <VStack gap="space-8" key={paraply.id}>
                    <VilkårOppsummeringRad
                        fom={paraply.fom}
                        tom={paraply.tom}
                        resultat={paraply.resultat}
                        gjelder="Midlertidig bosted"
                    />
                    <Box
                        paddingInline="space-16"
                        borderWidth="0 0 0 2"
                        borderColor="neutral-subtle"
                    >
                        <VStack gap="space-8">
                            {vilkår
                                .filter((reise) => reise.parentVilkår === paraply.globalId)
                                .sort((a, b) => (a.fom ?? '').localeCompare(b.fom ?? ''))
                                .map((reise) => {
                                    const reisemåte = finnTekstForTypeVilkårFakta(reise.typeFakta);
                                    const reiseformål = reise.typeReiseformål
                                        ? typeReiseformålTilTekst[reise.typeReiseformål]
                                        : '';

                                    return (
                                        <VilkårOppsummeringRad
                                            key={reise.id}
                                            fom={reise.fom}
                                            tom={reise.tom}
                                            resultat={reise.resultat}
                                            gjelder={`${reiseformål}${reisemåte ? ` - ${reisemåte}` : ''}`}
                                        />
                                    );
                                })}
                        </VStack>
                    </Box>
                </VStack>
            ))}
        </VStack>
    );
};
