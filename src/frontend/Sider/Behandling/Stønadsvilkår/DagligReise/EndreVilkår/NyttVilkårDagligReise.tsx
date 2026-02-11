import React, { useState } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, VStack } from '@navikt/ds-react';

import { EndreVilkårDagligReise } from './EndreVilkårDagligReise';
import { useSteg } from '../../../../../context/StegContext';
import { useVilkårDagligReise } from '../../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { Periode } from '../../../../../utils/periode';
import { FaktaDagligReise } from '../typer/faktaDagligReise';
import { SvarVilkårDagligReise } from '../typer/vilkårDagligReise';

interface Props {
    leggerTilNyttVilkår: boolean;
    startRedigering: () => boolean;
    avsluttRedigering: () => void;
}

export const NyttVilkårDagligReise: React.FC<Props> = ({
    leggerTilNyttVilkår,
    startRedigering,
    avsluttRedigering,
}) => {
    const { lagreNyttVilkår } = useVilkårDagligReise();
    const { erStegRedigerbart } = useSteg();

    const [visFeilmelding, settVisFeilmelding] = useState<boolean>(false);

    if (!erStegRedigerbart) {
        return null;
    }

    const opprettVilkår = async (
        periode: Periode,
        adresse: string | undefined,
        reiseId: string,
        svar: SvarVilkårDagligReise,
        fakta: FaktaDagligReise
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
            settVisFeilmelding(true);
        } else {
            settVisFeilmelding(false);
        }
    };

    return (
        <VStack gap="2">
            {leggerTilNyttVilkår ? (
                <EndreVilkårDagligReise
                    lagre={opprettVilkår}
                    avsluttRedigering={avsluttRedigering}
                />
            ) : (
                <>
                    <SmallButton
                        onClick={handleKlikkLeggTilNyPeriode}
                        variant="secondary"
                        icon={<PlusCircleIcon />}
                    >
                        Legg til ny periode
                    </SmallButton>
                    {visFeilmelding && (
                        <Alert variant="warning" size="small">
                            Ferdigstill redigering av annet vilkår før du starter ny redigering
                        </Alert>
                    )}
                </>
            )}
        </VStack>
    );
};
