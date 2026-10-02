import React, { FC, Fragment } from 'react';

import { BodyShort, HGrid, Label, VStack } from '@navikt/ds-react';

import { Delvilkår } from '../../../../vilkår';
import {
    regelIdTilSpørsmålKortversjon,
    svarIdTilTekstKorversjon,
} from '../../../../Vilkårvurdering/tekster';

export const LesevisningDelvilkår: FC<{
    delvilkårsett: Delvilkår[];
    slettetKommentar: string | undefined;
}> = ({ delvilkårsett, slettetKommentar }) => {
    return (
        <VStack gap="space-16" paddingBlock="space-16 space-0">
            {delvilkårsett.map((delvilkår, index) => (
                <HGrid
                    key={index}
                    gap="space-16 space-24"
                    columns="minmax(100px, max-content) 1fr"
                    height="fit-content"
                >
                    {delvilkår.vurderinger.map((vurdering, i) => (
                        <Fragment key={i}>
                            <VStack>
                                <BodyShort weight="semibold" size="small">
                                    {regelIdTilSpørsmålKortversjon[vurdering.regelId]}
                                </BodyShort>
                                {vurdering.svar && (
                                    <BodyShort size="small">
                                        {svarIdTilTekstKorversjon[vurdering.svar]}
                                    </BodyShort>
                                )}
                            </VStack>
                            <BodyShort size="small">{vurdering.begrunnelse}</BodyShort>
                        </Fragment>
                    ))}
                </HGrid>
            ))}
            {slettetKommentar && (
                <VStack>
                    <Label size="small">Begrunnelse for sletting:</Label>
                    <BodyShort size="small">{slettetKommentar}</BodyShort>
                </VStack>
            )}
        </VStack>
    );
};
