import React from 'react';

import { BodyShort, HelpText, VStack } from '@navikt/ds-react';

import { formaterNullableIsoDato } from '../../../../utils/dato';
import { GjennståndeFagerFraTelleverk } from '../typer/vilkårperiode/vilkårperiode';

export const HjelpetekstDagpenger: React.FC<{
    gjennståendeDagerFraTelleverk?: GjennståndeFagerFraTelleverk;
}> = ({ gjennståendeDagerFraTelleverk }) => (
    <HelpText>
        <VStack>
            <BodyShort size={'small'}>
                Det er ikke registrert noen tom-dato for dagpengevedtaket.
            </BodyShort>
            <BodyShort size={'small'}>
                {`Den ${formaterNullableIsoDato(gjennståendeDagerFraTelleverk?.dato)} hadde bruker ${gjennståendeDagerFraTelleverk?.antallDager ?? 'ukjent'} dager igjen med dagpenger.`}
            </BodyShort>
        </VStack>
    </HelpText>
);
