import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { EndreVilkårReiseOppstartAvslutningHjemreise } from './EndreVilkårReiseOppstartAvslutningHjemreise';
import { LeggTilNyPeriodeKnapp } from './LeggTilNyPeriodeKnapp';
import { useSteg } from '../../../../../context/StegContext';
import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import { Periode } from '../../../../../utils/periode';
import { FaktaReiseOppstartAvslutningHjemreise } from '../typer/faktaReiseOppstartAvslutningHjemreise';
import {
    SvarVilkårReiseOppstartAvslutningHjemreise,
    TypeReiseformål,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

interface Props {
    leggerTilNyttVilkår: boolean;
    startRedigering: () => boolean;
    avsluttRedigering: () => void;
}

export const NyttVilkårReiseOppstartAvslutningHjemreise: React.FC<Props> = ({
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
        periode: Periode,
        adresse: string | undefined,
        reiseId: string,
        typeReiseformål: TypeReiseformål | undefined,
        svar: SvarVilkårReiseOppstartAvslutningHjemreise,
        fakta: FaktaReiseOppstartAvslutningHjemreise
    ) => {
        return await lagreNyttVilkår({
            fom: periode.fom,
            tom: periode.tom,
            adresse: adresse || '',
            reiseId: reiseId,
            typeReiseformål: typeReiseformål as TypeReiseformål,
            svar: svar,
            fakta: fakta,
        });
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
