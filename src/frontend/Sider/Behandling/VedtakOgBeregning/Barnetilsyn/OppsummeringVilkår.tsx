import React, { FC } from 'react';

import { HStack, Label, VStack } from '@navikt/ds-react';

import { Vilkårsoppsummering } from '../../../../typer/vilkårsoppsummering';
import { utledNavnOgAlder } from '../../../../utils/tekstformatering';
import OppsummeringRad from '../Felles/OppsummeringRad';

const OppsummeringVilkår: FC<{ vilkårsoppsummering: Vilkårsoppsummering }> = ({
    vilkårsoppsummering,
}) => {
    return (
        <HStack gap="6">
            <VStack gap="4">
                <Label size="small">Inngangsvilkår</Label>
                <VStack gap="2">
                    <OppsummeringRad
                        tekst="Aktivitet"
                        vilkårOppfylt={vilkårsoppsummering.aktivitet}
                    />
                    <OppsummeringRad
                        tekst="Målgruppe"
                        vilkårOppfylt={vilkårsoppsummering.målgruppe}
                    />
                    <OppsummeringRad
                        tekst="Stønadsperiode"
                        vilkårOppfylt={vilkårsoppsummering.stønadsperiode}
                    />
                </VStack>
            </VStack>
            <VStack gap="4">
                <Label size="small">Pass barn</Label>
                <VStack gap="2">
                    {vilkårsoppsummering.passBarn.map((barn) => (
                        <OppsummeringRad
                            key={barn.barnId}
                            tekst={utledNavnOgAlder(barn.navn, barn.alder)}
                            vilkårOppfylt={barn.oppfyllerAlleVilkår}
                        />
                    ))}
                </VStack>
            </VStack>
        </HStack>
    );
};

export default OppsummeringVilkår;
