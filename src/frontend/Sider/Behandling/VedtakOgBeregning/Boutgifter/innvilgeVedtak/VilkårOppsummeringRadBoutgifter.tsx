import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { VilkårOppsummeringRad } from '../../../OppsummeringVilkår/VilkårOppsummeringRad';
import { Vilkårsvurdering } from '../../../vilkår';
import { vilkårTypeTilUtgiftTekst } from '../../../Vilkårvurdering/tekster';

export function VilkårOppsummeringRadBoutgifter(vilkårsvurdering: Vilkårsvurdering) {
    return (
        <>
            <BodyShort size={'small'}>Utgifter</BodyShort>
            <VStack gap={'2'}>
                {vilkårsvurdering.vilkårsett.map((vilkår) => (
                    <VilkårOppsummeringRad
                        key={vilkår.id}
                        resultat={vilkår.resultat}
                        fom={vilkår.fom}
                        tom={vilkår.tom}
                        gjelder={`${vilkår.utgift},- (${vilkårTypeTilUtgiftTekst[vilkår.vilkårType].toLowerCase()})`}
                    />
                ))}
            </VStack>
        </>
    );
}
