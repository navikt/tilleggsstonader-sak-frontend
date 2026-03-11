import React from 'react';

import { BodyLong, BodyShort, HelpText, HStack, VStack } from '@navikt/ds-react';

import { TypeRegisterYtelse } from '../../../../typer/registerytelser';
import { formaterNullableIsoDato } from '../../../../utils/dato';
import {
    GjennståndeFagerFraTelleverk,
    YtelseGrunnlagPeriode,
} from '../typer/vilkårperiode/vilkårperiode';

export const UkjentTom: React.FC<{ ytelse: YtelseGrunnlagPeriode }> = ({ ytelse }) => (
    <HStack gap={'space-4'} align={'center'}>
        <BodyShort size={'small'}>Ukjent</BodyShort>
        {ytelse.type === TypeRegisterYtelse.DAGPENGER && (
            <HjelpetekstDagpenger
                gjenståendeDagerFraTelleverk={ytelse.gjenståendeDagerFraTelleverk}
            />
        )}
    </HStack>
);

const HjelpetekstDagpenger: React.FC<{
    gjenståendeDagerFraTelleverk?: GjennståndeFagerFraTelleverk;
}> = ({ gjenståendeDagerFraTelleverk }) => (
    <HelpText>
        <VStack>
            <BodyLong size={'small'}>
                Det er ikke registrert noen sluttdato for dagpengevedtaket.
            </BodyLong>
            <BodyLong size={'small'}>
                Den {formaterNullableIsoDato(gjenståendeDagerFraTelleverk?.dato)} hadde bruker
                {gjenståendeDagerFraTelleverk?.antallDager ?? 'et ukjent antall'} dager igjen med
                dagpenger.
            </BodyLong>
        </VStack>
    </HelpText>
);
