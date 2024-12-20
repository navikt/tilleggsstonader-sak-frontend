import React from 'react';

import { HStack } from '@navikt/ds-react';

import Lesefelt from '../../../../komponenter/Skjema/Lesefelt';
import { Celle } from '../../../../komponenter/Visningskomponenter/Celle';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';

export const EndreAktivitetRegisterDetaljer = ({
    aktivitetFraRegister,
}: {
    aktivitetFraRegister: Registeraktivitet | undefined;
}) => {
    return (
        aktivitetFraRegister && (
            <HStack gap={'4'}>
                <Celle $width={180}>
                    <Lesefelt
                        label={'Variant'}
                        verdi={aktivitetFraRegister.typeNavn}
                        size={'small'}
                    />
                </Celle>
                <Celle>
                    <Lesefelt
                        label={'Arrangør'}
                        verdi={aktivitetFraRegister.arrangør}
                        size={'small'}
                    />
                </Celle>
            </HStack>
        )
    );
};
