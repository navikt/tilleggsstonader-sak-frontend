import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { EndreVilkårReiseOppstartAvslutningHjemreise } from './EndreVilkårReiseOppstartAvslutningHjemreise';
import { LeggTilNyPeriodeKnapp } from './LeggTilNyPeriodeKnapp';
import { useSteg } from '../../../../../context/StegContext';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { LagreVilkårFunksjon } from '../typer/vilkårReiseOppstartAvslutningHjemreise';

interface Props {
    aktivitet: Aktivitet;
    leggerTilNyttVilkår: boolean;
    startRedigering: () => boolean;
    avsluttRedigering: () => void;
    lagre: LagreVilkårFunksjon;
}

export const NyttVilkårReiseOppstartAvslutningHjemreise: React.FC<Props> = ({
    aktivitet,
    leggerTilNyttVilkår,
    startRedigering,
    avsluttRedigering,
    lagre,
}) => {
    const { erStegRedigerbart } = useSteg();

    const [feilmeldingRedigering, settFeilmeldingRedigering] = useState<string | undefined>(
        undefined
    );

    if (!erStegRedigerbart) {
        return null;
    }

    const handleKlikkLeggTilNyPeriode = () => {
        const kanStarte = startRedigering();
        if (!kanStarte) {
            settFeilmeldingRedigering(
                'Ferdigstill redigering av annet vilkår før du starter ny redigering'
            );
        } else {
            settFeilmeldingRedigering(undefined);
        }
    };

    return (
        <VStack gap="space-8">
            {leggerTilNyttVilkår ? (
                <EndreVilkårReiseOppstartAvslutningHjemreise
                    aktivitet={aktivitet}
                    lagre={lagre}
                    avsluttRedigering={avsluttRedigering}
                />
            ) : (
                <LeggTilNyPeriodeKnapp
                    onKlikk={handleKlikkLeggTilNyPeriode}
                    feilmelding={feilmeldingRedigering}
                    onLukkFeilmelding={() => settFeilmeldingRedigering(undefined)}
                />
            )}
        </VStack>
    );
};
