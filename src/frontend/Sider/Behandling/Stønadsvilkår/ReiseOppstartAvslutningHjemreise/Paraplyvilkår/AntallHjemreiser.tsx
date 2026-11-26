import React from 'react';

import { BodyShort, HStack, Label } from '@navikt/ds-react';

import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import { PeriodeStatus } from '../../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { RegelIdROAH } from '../typer/regelstrukturReiseOppstartAvslutningHjemreise';
import {
    ParaplyvilkårReiseOppstartAvslutningHjemreise,
    VilkårReiseOppstartAvslutningHjemreise,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

const reglerForSærligBehov: string[] = [
    RegelIdROAH.ROAH_HJEMREISE_SÆRLIG_BEHOV_UTENFOR_KVOTE,
    RegelIdROAH.ROAH_HJEMREISE_SÆRLIG_BEHOV_INNENFOR_KVOTE,
];

const erPgaSærligBehov = (reise: VilkårReiseOppstartAvslutningHjemreise) =>
    reise.delvilkårsett.some((delvilkår) =>
        delvilkår.vurderinger.some(
            (vurdering) =>
                reglerForSærligBehov.includes(vurdering.regelId) && vurdering.svar === 'JA'
        )
    );

export const AntallHjemreiser: React.FC<{
    paraplyvilkår: ParaplyvilkårReiseOppstartAvslutningHjemreise;
}> = ({ paraplyvilkår }) => {
    const { reiser } = useVilkårReiseOppstartAvslutningHjemreise();

    if (!paraplyvilkår.globalId) return null;

    const hjemreiser = reiser.filter(
        (reise) =>
            reise.parentVilkår === paraplyvilkår.globalId &&
            reise.fakta.typeReiseformål === 'HJEMREISE' &&
            (reise.status as string) !== PeriodeStatus.SLETTET
    );
    const antallSærligBehov = hjemreiser.filter(erPgaSærligBehov).length;
    const antallOrdinærKvote = hjemreiser.length - antallSærligBehov;

    return (
        <HStack gap="space-32">
            <div>
                <BodyShort size="small">Hjemreise ordinær kvote</BodyShort>
                <Label size="small">{antallOrdinærKvote}</Label>
            </div>
            <div>
                <BodyShort size="small">Hjemreise særlige behov</BodyShort>
                <Label size="small">{antallSærligBehov}</Label>
            </div>
        </HStack>
    );
};
