import React from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { FargetVilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { formaterNullablePeriode } from '../../../../utils/dato';
import { VilkårPeriodeResultat } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../vilkår';

interface VilkårOppsummeringRadProps {
    resultat?: VilkårPeriodeResultat | Vilkårsresultat;
    fom?: string;
    tom?: string;
    gjelder?: string;
}

export const VilkårOppsummeringRad: React.FC<VilkårOppsummeringRadProps> = ({
    resultat,
    fom,
    tom,
    gjelder,
}) => {
    const skalHaKolon = gjelder !== '';

    return (
        <HStack gap={'2'} align={'center'} className={'info'} wrap={false}>
            {resultat && <FargetVilkårsresultatIkon vilkårsresultat={resultat} />}
            <BodyShort size="small">
                {`${formaterNullablePeriode(fom, tom)}${skalHaKolon ? ':' : ''} ${gjelder}`}
            </BodyShort>
        </HStack>
    );
};
