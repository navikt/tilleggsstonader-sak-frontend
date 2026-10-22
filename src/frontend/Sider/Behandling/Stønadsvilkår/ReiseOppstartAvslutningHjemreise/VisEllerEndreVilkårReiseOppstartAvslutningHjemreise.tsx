import React, { FC, useState } from 'react';

import { EndreVilkårReiseOppstartAvslutningHjemreise } from './EndreVilkår/EndreVilkårReiseOppstartAvslutningHjemreise';
import { LesevisningVilkårReiseOppstartAvslutningHjemreise } from './Lesevisning/LesevisningVilkårReiseOppstartAvslutningHjemreise';
import {
    LagreNyttVilkårReiseOppstartAvslutningHjemreise,
    VilkårReiseOppstartAvslutningHjemreise,
} from './typer/vilkårReiseOppstartAvslutningHjemreise';
import { useSteg } from '../../../../context/StegContext';
import { useVilkårReiseOppstartAvslutningHjemreise } from '../../../../context/VilkårReiseOppstartAvslutningHjemreiseContext/VilkårReiseOppstartAvslutningHjemreiseContext';
import { Aktivitet } from '../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

interface Props {
    vilkår: VilkårReiseOppstartAvslutningHjemreise;
    aktivitet: Aktivitet;
    redigerer: boolean;
    redigererAnnetVilkår: boolean;
    startRedigering: () => boolean;
    avsluttRedigering: () => void;
}

export const VisEllerEndreVilkårReiseOppstartAvslutningHjemreise: FC<Props> = ({
    vilkår,
    aktivitet,
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

    const lagre = async (vilkårTilLagring: LagreNyttVilkårReiseOppstartAvslutningHjemreise) => {
        return await oppdaterVilkår(vilkår.id, vilkårTilLagring);
    };

    return (
        <>
            {erStegRedigerbart && redigerer ? (
                <EndreVilkårReiseOppstartAvslutningHjemreise
                    vilkår={vilkår}
                    aktivitet={aktivitet}
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
