import React from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { FargetVilkårsresultatIkon } from '../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { formaterNullablePeriode } from '../../../../utils/dato';
import {
    Studienivå,
    studienivåTilTekst,
} from '../../Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';
import { VilkårPeriodeResultat } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../vilkår';

interface VilkårOppsummeringRadProps {
    resultat?: VilkårPeriodeResultat | Vilkårsresultat;
    fom?: string;
    tom?: string;
    gjelder?: string;
    aktivitetsdager?: number;
    studienivå?: Studienivå;
}

export const VilkårOppsummeringRad: React.FC<VilkårOppsummeringRadProps> = ({
    resultat,
    fom,
    tom,
    gjelder,
    aktivitetsdager,
    studienivå,
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
                {studienivå && <BodyShort size="small">{studienivåTilTekst[studienivå]}</BodyShort>}
            </VStack>
        </HStack>
    );
};
