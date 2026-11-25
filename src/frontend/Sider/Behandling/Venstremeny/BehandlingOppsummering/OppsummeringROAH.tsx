import React from 'react';

import { Box, Label, VStack } from '@navikt/ds-react';

import styles from './BehandlingOppsummering.module.css';
import { VilkårOppsummeringRad } from './OppsummeringRad';
import { finnTekstForTypeVilkårFakta } from './oppsummeringUtils';
import { OppsummertVilkår } from '../../../../typer/behandling/behandlingOppsummering';
import { typeReiseformålTilTekst } from '../../Stønadsvilkår/ReiseOppstartAvslutningHjemreise/typer/vilkårReiseOppstartAvslutningHjemreise';

export const OppsummeringROAH: React.FC<{ vilkår: OppsummertVilkår[] }> = ({ vilkår }) => {
    return (
        <VStack gap="space-8">
            <Label size="small">Oppstart, avslutning og hjemreiser</Label>
            {vilkår.map((paraply) => (
                <VStack gap="space-8" key={paraply.id}>
                    <VilkårOppsummeringRad
                        fom={paraply.fom}
                        tom={paraply.tom}
                        resultat={paraply.resultat}
                        gjelder="Midlertidig bosted"
                    />
                    <Box
                        className={styles.childVilkårMarkør}
                        paddingInline="space-16"
                        borderWidth="0 0 0 2"
                        borderColor="neutral-subtle"
                    >
                        <VStack gap="space-8">
                            {paraply.childVilkår.map((reise) => {
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
