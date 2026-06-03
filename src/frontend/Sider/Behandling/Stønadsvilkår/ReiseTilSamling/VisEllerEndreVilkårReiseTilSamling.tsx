import React, { FC, useState } from 'react';

import { EndreVilkårReiseTilSamling } from './EndreVilkår/EndreVilkårReiseTilSamling';
import { LesevisningVilkårReiseTilSamling } from './Lesevisning/LesevisningVilkårReiseTilSamling';
import { FaktaReiseTilSamling } from './typer/faktaReiseTilSamling';
import { SvarVilkårReiseTilSamling, VilkårReiseTilSamling } from './typer/vilkårReiseTilSamling';
import { useSteg } from '../../../../context/StegContext';
import { useVilkårReiseTilSamling } from '../../../../context/VilkårReiseTilSamlingContext/VilkårReiseTilSamlingContext';
import { Periode } from '../../../../utils/periode';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

interface Props {
    vilkår: VilkårReiseTilSamling;
    redigerer: boolean;
    redigererAnnetVilkår: boolean;
    startRedigering: () => boolean;
    avsluttRedigering: () => void;
}

export const VisEllerEndreVilkårReiseTilSamling: FC<Props> = ({
    vilkår,
    redigerer,
    startRedigering,
    avsluttRedigering,
}) => {
    const { erStegRedigerbart } = useSteg();
    const { oppdaterVilkår } = useVilkårReiseTilSamling();

    const [feilmeldingRedigering, settFeilmeldingRedigering] = useState<string | undefined>(
        undefined
    );

    const sjekkOgSettFeilmelding = (kanStarte: boolean) => {
        if (!kanStarte) {
            settFeilmeldingRedigering(
                'Ferdigstill redigering av annet vilkår før du starter ny redigering'
            );
        }
        return kanStarte;
    };

    const handleStartRedigering = () => {
        sjekkOgSettFeilmelding(startRedigering());
    };

    const nullstillFeilmeldingRedigering = () => {
        settFeilmeldingRedigering(undefined);
    };

    const skalViseRedigeringsknapp = !!erStegRedigerbart && vilkår.status !== PeriodeStatus.SLETTET;

    const lagre = async (
        periode: Periode,
        adresse: string | undefined,
        reiseId: string,
        svar: SvarVilkårReiseTilSamling,
        fakta: FaktaReiseTilSamling
    ) => {
        return await oppdaterVilkår(vilkår.id, {
            fom: periode.fom,
            tom: periode.tom,
            adresse: adresse || '',
            reiseId: reiseId,
            svar: svar,
            fakta: fakta,
        });
    };

    return (
        <>
            {erStegRedigerbart && redigerer ? (
                <EndreVilkårReiseTilSamling
                    vilkår={vilkår}
                    lagre={lagre}
                    avsluttRedigering={avsluttRedigering}
                />
            ) : (
                <LesevisningVilkårReiseTilSamling
                    vilkår={vilkår}
                    skalViseRedigeringsknapp={skalViseRedigeringsknapp}
                    startRedigering={handleStartRedigering}
                    feilmeldingRedigering={feilmeldingRedigering}
                    nullstillFeilmeldingRedigering={nullstillFeilmeldingRedigering}
                />
            )}
        </>
    );
};
