import React, { FC, useState } from 'react';

import { EndreVilkårReiseOppstartAvslutningHjemreise } from './EndreVilkår/EndreVilkårReiseOppstartAvslutningHjemreise';
import { LesevisningVilkårReiseOppstartAvslutningHjemreise } from './Lesevisning/LesevisningVilkårReiseOppstartAvslutningHjemreise';
import { FaktaReiseOppstartAvslutningHjemreise } from './typer/faktaReiseOppstartAvslutningHjemreise';
import {
    SvarVilkårReiseOppstartAvslutningHjemreise,
    TypeReiseformål,
    VilkårReiseOppstartAvslutningHjemreise,
} from './typer/vilkårReiseOppstartAvslutningHjemreise';
import { useSteg } from '../../../../context/StegContext';
import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import { Periode } from '../../../../utils/periode';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

interface Props {
    vilkår: VilkårReiseOppstartAvslutningHjemreise;
    redigerer: boolean;
    redigererAnnetVilkår: boolean;
    startRedigering: () => boolean;
    avsluttRedigering: () => void;
}

export const VisEllerEndreVilkårReiseOppstartAvslutningHjemreise: FC<Props> = ({
    vilkår,
    redigerer,
    startRedigering,
    avsluttRedigering,
}) => {
    const { erStegRedigerbart } = useSteg();
    const { oppdaterVilkår } = useVilkårReiseOppstartAvslutningHjemreise();

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
        typeReiseformål: TypeReiseformål | undefined,
        svar: SvarVilkårReiseOppstartAvslutningHjemreise,
        fakta: FaktaReiseOppstartAvslutningHjemreise
    ) => {
        return await oppdaterVilkår(vilkår.id, {
            fom: periode.fom,
            tom: periode.tom,
            adresse: adresse || '',
            reiseId: reiseId,
            typeReiseformål: typeReiseformål as TypeReiseformål,
            svar: svar,
            fakta: fakta,
        });
    };

    return (
        <>
            {erStegRedigerbart && redigerer ? (
                <EndreVilkårReiseOppstartAvslutningHjemreise
                    vilkår={vilkår}
                    lagre={lagre}
                    avsluttRedigering={avsluttRedigering}
                />
            ) : (
                <LesevisningVilkårReiseOppstartAvslutningHjemreise
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
