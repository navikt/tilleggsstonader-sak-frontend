import React from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { FargetVilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { formaterNullablePeriode } from '../../../../utils/dato';
import { VilkårPeriodeResultat } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../vilkår';

interface VilkårOppsummeringRadProps {
    resultat?: VilkårPeriodeResultat | Vilkårsresultat;
    fom?: string;
    tom?: string;
    gjelder?: string;
    aktivitetsdager?: number;
}

export const VilkårOppsummeringRad: React.FC<VilkårOppsummeringRadProps> = ({
    resultat,
    fom,
    tom,
    gjelder,
    aktivitetsdager,
}) => {
    const skalHaKolon = gjelder !== '' || aktivitetsdager !== null;

    return (
        <HStack gap={'2'} align={'center'} className={'info'} wrap={false}>
            {resultat && <FargetVilkårsresultatIkon vilkårsresultat={resultat} />}
            <VStack>
                <BodyShort size="small">
                    {`${formaterNullablePeriode(fom, tom)}${skalHaKolon ? ':' : ''} ${gjelder}`}
                </BodyShort>
                {aktivitetsdager && (
                    <BodyShort size="small">{`${aktivitetsdager} dager/uke`}</BodyShort>
                )}
            </VStack>
        </HStack>
    );
};
