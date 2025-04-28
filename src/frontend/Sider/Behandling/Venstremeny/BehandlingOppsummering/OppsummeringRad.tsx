import React from 'react';

import { HStack, BodyShort } from '@navikt/ds-react';

import { VilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
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
    return (
        <HStack gap={'2'} align={'center'} className={'info'} wrap={false}>
            {resultat && <VilkårsresultatIkon vilkårsresultat={resultat} height={18} width={18} />}
            <BodyShort
                size={'small'}
            >{`${formaterNullablePeriode(fom, tom)}: ${gjelder}`}</BodyShort>
        </HStack>
    );
};
