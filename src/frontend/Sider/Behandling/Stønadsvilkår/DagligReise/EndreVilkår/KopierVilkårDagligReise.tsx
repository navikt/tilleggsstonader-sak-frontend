import React from 'react';

import { v7 } from 'uuid';

import { EndreVilkårDagligReise } from './EndreVilkårDagligReise';
import { useVilkårDagligReise } from '../../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import { Periode } from '../../../../../utils/periode';
import { FaktaDagligReise } from '../typer/faktaDagligReise';
import { SvarVilkårDagligReise, VilkårDagligReise } from '../typer/vilkårDagligReise';

interface Props {
    kopierFra: VilkårDagligReise;
    avsluttKopiering: () => void;
    tomFraVilkårSomKopieres: string | undefined;
}

export const KopierVilkårDagligReise: React.FC<Props> = ({
    kopierFra,
    avsluttKopiering,
    tomFraVilkårSomKopieres,
}) => {
    const { lagreNyttVilkår } = useVilkårDagligReise();

    const vilkårMedNyReiseId: VilkårDagligReise = {
        ...kopierFra,
        reiseId: v7(),
    };

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

    const handleAvsluttRedigering = () => {
        avsluttKopiering();
    };

    return (
        <EndreVilkårDagligReise
            vilkår={vilkårMedNyReiseId}
            lagre={opprettVilkår}
            avsluttRedigering={handleAvsluttRedigering}
            tomFraVilkårSomKopieres={tomFraVilkårSomKopieres}
        />
    );
};
