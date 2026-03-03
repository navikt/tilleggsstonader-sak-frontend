import React from 'react';

import { BodyLong, HelpText, VStack } from '@navikt/ds-react';

import { formaterNullableIsoDato } from '../../../../utils/dato';
import { GjennståndeFagerFraTelleverk } from '../typer/vilkårperiode/vilkårperiode';

export const HjelpetekstDagpenger: React.FC<{
    gjennståendeDagerFraTelleverk?: GjennståndeFagerFraTelleverk;
}> = ({ gjennståendeDagerFraTelleverk }) => (
    <HelpText>
        <VStack>
            <BodyLong size={'small'}>
                Det er ikke registrert noen sluttdato for dagpengevedtaket.
            </BodyLong>
            <BodyLong size={'small'}>
                Den {formaterNullableIsoDato(gjennståendeDagerFraTelleverk?.dato)} hadde bruker
                {gjennståendeDagerFraTelleverk?.antallDager ?? 'et ukjent antall'} dager igjen med
                dagpenger.
            </BodyLong>
        </VStack>
    </HelpText>
);
