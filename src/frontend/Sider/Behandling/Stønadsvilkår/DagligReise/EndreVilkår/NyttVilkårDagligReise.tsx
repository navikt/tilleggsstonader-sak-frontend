import React, { useEffect, useState } from 'react';

import { v7 } from 'uuid';

import { PlusCircleIcon } from '@navikt/aksel-icons';

import { EndreVilkårDagligReise } from './EndreVilkårDagligReise';
import { useSteg } from '../../../../../context/StegContext';
import { useVilkårDagligReise } from '../../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { Periode } from '../../../../../utils/periode';
import { FaktaDagligReise } from '../typer/faktaDagligReise';
import { SvarVilkårDagligReise, VilkårDagligReise } from '../typer/vilkårDagligReise';

interface Props {
    kopierFra?: VilkårDagligReise;
    avsluttKopiering: () => void;
}

export const NyttVilkårDagligReise: React.FC<Props> = ({ kopierFra, avsluttKopiering }) => {
    const { lagreNyttVilkår } = useVilkårDagligReise();
    const { erStegRedigerbart } = useSteg();

    const [leggerTilNyttVilkår, settLeggerTilNyttVilkår] = useState<boolean>(false);

    // Åpne redigeringsmodus når kopierFra settes
    useEffect(() => {
        if (kopierFra) {
            settLeggerTilNyttVilkår(true);
        }
    }, [kopierFra]);

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

    if (!leggerTilNyttVilkår) {
        return (
            <SmallButton
                onClick={() => settLeggerTilNyttVilkår(true)}
                variant="secondary"
                icon={<PlusCircleIcon />}
            >
                Legg til ny periode
            </SmallButton>
        );
    }

    const handleAvsluttRedigering = () => {
        settLeggerTilNyttVilkår(false);
        avsluttKopiering();
    };

    // Kopier vilkår med ny generert reiseId
    const vilkårDataForKopiering: VilkårDagligReise | undefined = kopierFra
        ? {
              ...kopierFra,
              reiseId: v7(),
          }
        : undefined;

    return (
        <EndreVilkårDagligReise
            vilkår={vilkårDataForKopiering}
            lagre={opprettVilkår}
            avsluttRedigering={handleAvsluttRedigering}
        />
    );
};
