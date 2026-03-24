import React from 'react';

import { BodyLong, BodyShort, HelpText, HStack, VStack } from '@navikt/ds-react';

import { TypeRegisterYtelse } from '../../../../typer/registerytelser';
import { formaterNullableIsoDato, leggTilDager } from '../../../../utils/dato';
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
}> = ({ gjenståendeDagerFraTelleverk }) => {
    const estimertSluttdatoDagpenger = formaterNullableIsoDato(
        gjenståendeDagerFraTelleverk
            ? leggTilDager(
                  gjenståendeDagerFraTelleverk.dato,
                  gjenståendeDagerFraTelleverk.antallDager
              )
            : undefined
    );

    return (
        <HelpText>
            <VStack gap={'space-4'}>
                <BodyLong size={'small'}>
                    Det er ikke registrert noen sluttdato for dagpengevedtaket.
                </BodyLong>
                {estimertSluttdatoDagpenger ? (
                    <>
                        <BodyLong size={'small'}>
                            Ut fra gjenstående dager med rett til dagpenger hentet fra Arena/DP‑sak,
                            estimerer vi sluttdatoen til å være tidligst{' '}
                            {estimertSluttdatoDagpenger}.
                        </BodyLong>

                        <BodyLong size={'small'}>
                            Hvis beregnet sluttdato for dagpenger er før tiltakets sluttdato, settes{' '}
                            <i>til‑og‑med‑dato</i> lik beregnet sluttdato for dagpenger.
                        </BodyLong>
                        <BodyLong size={'small'}>
                            Hvis beregnet sluttdato for dagpenger er etter tiltakets sluttdato,
                            settes <i>til‑og‑med‑dato</i> lik tiltakets sluttdato.
                        </BodyLong>
                    </>
                ) : (
                    <BodyLong size={'small'}>
                        Vi har per d.d. ingen informasjon om antall gjenstående dager bruker har
                        rett på dagpenger.
                    </BodyLong>
                )}
            </VStack>
        </HelpText>
    );
};
