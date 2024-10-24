import React from 'react';

import { BodyShort, HGrid, HStack } from '@navikt/ds-react';

import { Delvilkår } from '../vilkår';
import { regelIdTilSpørsmålKortversjon, svarIdTilTekstKortversjon } from './tekster';

export function Vurderingsrad(props: { delvilkår: Delvilkår }) {
    return (
        <>
            {props.delvilkår.vurderinger.map((vurdering, index) => (
                <HGrid
                    gap={{ md: '4', lg: '8' }}
                    columns="minmax(auto, 250px) auto"
                    key={vurdering.regelId}
                >
                    <HStack gap="2">
                        <BodyShort weight="semibold" size="small">
                            {regelIdTilSpørsmålKortversjon[vurdering.regelId]}
                        </BodyShort>
                        {vurdering.svar && (
                            <BodyShort size="small">
                                {svarIdTilTekstKortversjon[vurdering.svar]}
                            </BodyShort>
                        )}
                    </HStack>
                    {index == props.delvilkår.vurderinger.length - 1 && (
                        // Vilkårene er satt opp slik at kun "siste" vurdering i et delvilkår vil ha begrunnelse.
                        <BodyShort size="small">{vurdering.begrunnelse}</BodyShort>
                    )}
                </HGrid>
            ))}
        </>
    );
}
