import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { EndreVilkårReiseOppstartAvslutningHjemreise } from './EndreVilkårReiseOppstartAvslutningHjemreise';
import { LeggTilNyPeriodeKnapp } from './LeggTilNyPeriodeKnapp';
import { useSteg } from '../../../../../context/StegContext';
import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { LagreNyttVilkårReiseOppstartAvslutningHjemreise } from '../typer/vilkårReiseOppstartAvslutningHjemreise';
interface Props {
    aktivitet: Aktivitet;
    leggerTilNyttVilkår: boolean;
    startRedigering: () => boolean;
    avsluttRedigering: () => void;
}

export const NyttVilkårReiseOppstartAvslutningHjemreise: React.FC<Props> = ({
    aktivitet,
    leggerTilNyttVilkår,
    startRedigering,
    avsluttRedigering,
}) => {
    const { lagreNyttVilkår } = useVilkårReiseOppstartAvslutningHjemreise();
    const { erStegRedigerbart } = useSteg();

    const [feilmeldingRedigering, settFeilmeldingRedigering] = useState<string | undefined>(
        undefined
    );

    if (!erStegRedigerbart) {
        return null;
    }

    const opprettVilkår = async (
        oppdatertVilkår: LagreNyttVilkårReiseOppstartAvslutningHjemreise
    ) => {
        return await lagreNyttVilkår(oppdatertVilkår);
    };

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
                    lagre={opprettVilkår}
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
