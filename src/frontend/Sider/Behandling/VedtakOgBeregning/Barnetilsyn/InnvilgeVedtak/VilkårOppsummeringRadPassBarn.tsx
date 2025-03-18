import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { BehandlingFaktaTilsynBarn } from '../../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { VilkårOppsummeringRad } from '../../../OppsummeringVilkår/VilkårOppsummeringRad';
import { Vilkårsvurdering } from '../../../vilkår';

export function VilkårOppsummeringRadPassBarn(
    vilkårsvurdering: Vilkårsvurdering,
    behandlingFakta: BehandlingFaktaTilsynBarn
) {
    const finnBarnNavn = (
        barnId: string | undefined,
        behandlingFakta: BehandlingFaktaTilsynBarn
    ) => {
        return behandlingFakta.barn.find((barn) => barn.barnId === barnId)?.registergrunnlag.navn;
    };
    return (
        <>
            <BodyShort size={'small'}>Pass av barn</BodyShort>
            <VStack gap={'2'}>
                {vilkårsvurdering.vilkårsett.map((vilkår) => (
                    <VilkårOppsummeringRad
                        key={vilkår.id}
                        resultat={vilkår.resultat}
                        fom={vilkår.fom}
                        tom={vilkår.tom}
                        gjelder={finnBarnNavn(vilkår.barnId, behandlingFakta)}
                    />
                ))}
            </VStack>
        </>
    );
}
