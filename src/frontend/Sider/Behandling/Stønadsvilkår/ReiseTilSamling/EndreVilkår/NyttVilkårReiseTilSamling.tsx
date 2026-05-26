import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { EndreVilkårReiseTilSamling } from './EndreVilkårReiseTilSamling';
import { LeggTilNyPeriodeKnapp } from './LeggTilNyPeriodeKnapp';
import { useSteg } from '../../../../../context/StegContext';
import { useVilkårReiseTilSamling } from '../../../../../context/VilkårReiseTilSamlingContext/VilkårReiseTilSamlingContext';
import { Periode } from '../../../../../utils/periode';
import { FaktaReiseTilSamling } from '../typer/faktaReiseTilSamling';
import { SvarVilkårReiseTilSamling } from '../typer/vilkårReiseTilSamling';

interface Props {
    leggerTilNyttVilkår: boolean;
    startRedigering: () => boolean;
    avsluttRedigering: () => void;
}

export const NyttVilkårReiseTilSamling: React.FC<Props> = ({
    leggerTilNyttVilkår,
    startRedigering,
    avsluttRedigering,
}) => {
    const { lagreNyttVilkår } = useVilkårReiseTilSamling();
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
        svar: SvarVilkårReiseTilSamling,
        fakta: FaktaReiseTilSamling
    ) => {
        return await lagreNyttVilkår({
            fom: periode.fom,
            tom: periode.tom,
            adresse: adresse || '',
            reiseId: reiseId,
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
                <EndreVilkårReiseTilSamling
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
