import React, { FC } from 'react';

import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';

import begrunnelseStyles from '../../../../../komponenter/Begrunnelse.module.css';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import { formaterNullableIsoDato } from '../../../../../utils/dato';
import { svarIdTilTekst } from '../../../Vilkårvurdering/tekster';
import {
    RegelIdROAH,
    regelIdTilSpørsmålROAH,
} from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';
import { ParaplyvilkårReiseOppstartAvslutningHjemreise } from '../typer/vilkårReiseOppstartAvslutningHjemreise';

export const LesevisningMidlertidigBostedPeriode: FC<{
    vilkår: ParaplyvilkårReiseOppstartAvslutningHjemreise;
}> = ({ vilkår }) => {
    const vurderinger = vilkår.delvilkårsett.flatMap((delvilkår) => delvilkår.vurderinger);

    return (
        <VStack gap="space-16">
            <HStack gap="space-32">
                <div>
                    <BodyShort size="small">Fra</BodyShort>
                    <Label size="small">{formaterNullableIsoDato(vilkår.fom) ?? '-'}</Label>
                </div>
                <div>
                    <BodyShort size="small">Til</BodyShort>
                    <Label size="small">{formaterNullableIsoDato(vilkår.tom) ?? '-'}</Label>
                </div>
                <div>
                    <BodyShort size="small">Fra adresse</BodyShort>
                    <Label size="small">{vilkår.fraAdresse || '-'}</Label>
                </div>
                <div>
                    <BodyShort size="small">Til adresse</BodyShort>
                    <Label size="small">{vilkår.tilAdresse || '-'}</Label>
                </div>
            </HStack>
            <Skillelinje utenMargin />
            {/* Besvarte spørsmål med svar og begrunnelse */}
            {vurderinger.map((vurdering) => {
                if (!vurdering.svar) return null;
                return (
                    <VStack key={vurdering.regelId} gap="space-2">
                        <BodyShort size="small" weight="semibold">
                            {regelIdTilSpørsmålROAH[vurdering.regelId as RegelIdROAH]}
                        </BodyShort>
                        <BodyShort size="small">
                            {svarIdTilTekst[vurdering.svar] ?? vurdering.svar}
                        </BodyShort>
                        {vurdering.begrunnelse && (
                            <BodyShort size="small" className={begrunnelseStyles.bevarLinjeskift}>
                                {vurdering.begrunnelse}
                            </BodyShort>
                        )}
                    </VStack>
                );
            })}
        </VStack>
    );
};
