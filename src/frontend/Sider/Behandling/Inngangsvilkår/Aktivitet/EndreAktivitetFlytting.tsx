import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { Aktivitet } from '../typer/vilkårperiode/aktivitet';

// TODO: Implementer aktivitetsredigering for Flytting
export const EndreAktivitetFlytting: React.FC<{
    aktivitet?: Aktivitet;
    aktivitetFraRegister?: Registeraktivitet;
    avbrytRedigering: () => void;
}> = () => {
    return <BodyShort>TODO: Implementer EndreAktivitet for Flytting</BodyShort>;
};
