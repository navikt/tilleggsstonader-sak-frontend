import React from 'react';

import { EndreVilkårReiseTilSamling } from './EndreVilkårReiseTilSamling';
import { useVilkårReiseTilSamling } from '../../../../../context/VilkårReiseTilSamlingContext/VilkårReiseTilSamlingContext';
import { Periode } from '../../../../../utils/periode';
import { FaktaReiseTilSamling } from '../typer/faktaReiseTilSamling';
import { SvarVilkårReiseTilSamling, VilkårReiseTilSamling } from '../typer/vilkårReiseTilSamling';

interface Props {
    kildeVilkår: VilkårReiseTilSamling;
    avsluttKopiering: () => void;
}

export const KopierVilkårReiseTilSamling: React.FC<Props> = ({ kildeVilkår, avsluttKopiering }) => {
    const { lagreNyttVilkår } = useVilkårReiseTilSamling();

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

    const handleAvsluttRedigering = () => {
        avsluttKopiering();
    };

    return (
        <EndreVilkårReiseTilSamling
            lagre={opprettVilkår}
            avsluttRedigering={handleAvsluttRedigering}
            periodeFraVilkårSomKopieres={{ fom: kildeVilkår.fom || '', tom: kildeVilkår.tom || '' }}
            adresseFraVilkårSomKopieres={kildeVilkår.adresse}
        />
    );
};
