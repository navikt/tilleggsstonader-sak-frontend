import React, { FC, Fragment } from 'react';

import { BodyShort, HGrid, HStack, Label, VStack } from '@navikt/ds-react';

import begrunnelseStyles from '../../../../../komponenter/Begrunnelse.module.css';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import { Delvilkår } from '../../../vilkår';
import {
    regelIdTilSpørsmålKortversjon,
    svarIdTilTekstKorversjon,
} from '../../../Vilkårvurdering/tekster';

export const LesevisningDelvilkår: FC<{
    delvilkårsett: Delvilkår[];
    slettetKommentar?: string;
    skalViseSkillelinje: boolean;
}> = ({ delvilkårsett, slettetKommentar, skalViseSkillelinje }) => {
    return (
        <VStack gap="space-4" paddingBlock="space-16 space-0">
            {delvilkårsett.map((delvilkår, index) => (
                <HGrid
                    key={index}
                    gap="space-16 space-24"
                    columns="minmax(100px, max-content) 1fr"
                    height="fit-content"
                >
                    {delvilkår.vurderinger.map((vurdering, i) => {
                        if (!vurdering.svar) return null;

                        return (
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
                                <BodyShort
                                    size="small"
                                    className={begrunnelseStyles.bevarLinjeskift}
                                >
                                    {vurdering.begrunnelse}
                                </BodyShort>
                                {skalViseSkillelinje && i < delvilkår.vurderinger.length - 1 && (
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <Skillelinje utenMargin />
                                    </div>
                                )}
                            </Fragment>
                        );
                    })}
                </HGrid>
            ))}
            {slettetKommentar && (
                <HStack gap="space-16">
                    <Label size="small">Begrunnelse for sletting:</Label>
                    <BodyShort size="small" className={begrunnelseStyles.bevarLinjeskift}>
                        {slettetKommentar}
                    </BodyShort>
                </HStack>
            )}
        </VStack>
    );
};
