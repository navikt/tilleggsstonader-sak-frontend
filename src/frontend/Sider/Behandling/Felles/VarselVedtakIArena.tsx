import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import styles from './VarselVedtakIArena.module.css';
import { formaterDato } from '../../../utils/dato';

type Props = {
    arenaVedtakTom: string;
};

export const VarselVedtakIArena = ({ arenaVedtakTom }: Props) => {
    return (
        <div className={styles.container}>
            <Heading size={'xsmall'}>
                {`Søker har vedtak i Arena til og med ${formaterDato(arenaVedtakTom)}`}
            </Heading>
            <BodyShort size={'small'}>
                Skal du innvilge tilbake i tid? Gå til Arena for å sjekke at det ikke blir
                overlappende utbetalinger.
            </BodyShort>
        </div>
    );
};
