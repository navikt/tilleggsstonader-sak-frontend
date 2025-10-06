import React from 'react';

import { BodyShort, Box } from '@navikt/ds-react';
import { ALimegreen50 } from '@navikt/ds-tokens/dist/tokens';

import { formaterDato } from '../../../utils/dato';

type Props = {
    arenaVedtakTom: string;
};

export const VarselVedtakIArena = ({ arenaVedtakTom }: Props) => {
    return (
        <Box
            borderColor="border-subtle"
            padding="space-16"
            borderWidth="1"
            borderRadius="large"
            style={{ backgroundColor: ALimegreen50 }}
        >
            <BodyShort size={'small'} weight={'semibold'}>
                {`Saker har vedtak i Arena til og med ${formaterDato(arenaVedtakTom)}`}
            </BodyShort>
            <BodyShort size={'small'}>
                Skal du innvilge tilbake i tid? Gå til Arena for å sjekke at det ikke blir
                overlappende utbetalinger.
            </BodyShort>
        </Box>
    );
};
