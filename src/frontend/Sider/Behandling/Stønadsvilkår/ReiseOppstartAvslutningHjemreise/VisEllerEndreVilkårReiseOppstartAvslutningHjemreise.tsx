import React, { FC, useState } from 'react';

import { EndreVilkårReiseOppstartAvslutningHjemreise } from './EndreVilkår/EndreVilkårReiseOppstartAvslutningHjemreise';
import { LesevisningVilkårReiseOppstartAvslutningHjemreise } from './Lesevisning/LesevisningVilkårReiseOppstartAvslutningHjemreise';
import {
    LagreVilkårFunksjon,
    SlettVilkårFunksjon,
    VilkårReiseOppstartAvslutningHjemreise,
} from './typer/vilkårReiseOppstartAvslutningHjemreise';
import { useSteg } from '../../../../context/StegContext';
import { Aktivitet } from '../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

interface Props {
    vilkår: VilkårReiseOppstartAvslutningHjemreise;
    aktivitet: Aktivitet;
    redigerer: boolean;
    redigererAnnetVilkår: boolean;
    startRedigering: () => boolean;
    avsluttRedigering: () => void;
    lagre: LagreVilkårFunksjon;
    slett: SlettVilkårFunksjon;
}

export const VisEllerEndreVilkårReiseOppstartAvslutningHjemreise: FC<Props> = ({
    vilkår,
    aktivitet,
    redigerer,
    startRedigering,
    avsluttRedigering,
    lagre,
    slett,
}) => {
    const { erStegRedigerbart } = useSteg();

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

    return (
        <>
            {erStegRedigerbart && redigerer ? (
                <EndreVilkårReiseOppstartAvslutningHjemreise
                    vilkår={vilkår}
                    aktivitet={aktivitet}
                    lagre={lagre}
                    slett={slett}
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
