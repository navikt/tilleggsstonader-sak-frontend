import React, { FC, useState } from 'react';

import { EndreVilkårDagligReise } from './EndreVilkår/EndreVilkårDagligReise';
import LesevisningVilkårDagligReise from './Lesevisning/LesevisningVilkårDagligReise';
import { FaktaDagligReise } from './typer/faktaDagligReise';
import { SvarVilkårDagligReise, VilkårDagligReise } from './typer/vilkårDagligReise';
import { useSteg } from '../../../../context/StegContext';
import { useVilkårDagligReise } from '../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import { Periode } from '../../../../utils/periode';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

interface Props {
    vilkår: VilkårDagligReise;
    startKopiering: (vilkår: VilkårDagligReise) => void;
}

export const VisEllerEndreVilkårDagligReise: FC<Props> = ({ vilkår, startKopiering }) => {
    const { erStegRedigerbart } = useSteg();
    const { oppdaterVilkår } = useVilkårDagligReise();

    const [redigerer, settRedigerer] = useState<boolean>(false);

    const skalViseRedigeringsknapp = erStegRedigerbart && vilkår.status !== PeriodeStatus.SLETTET;

    const lagre = async (
        periode: Periode,
        adresse: string | undefined,
        reiseId: string,
        svar: SvarVilkårDagligReise,
        fakta: FaktaDagligReise
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

    return erStegRedigerbart && redigerer ? (
        <EndreVilkårDagligReise
            vilkår={vilkår}
            lagre={lagre}
            avsluttRedigering={() => settRedigerer(false)}
        />
    ) : (
        <LesevisningVilkårDagligReise
            vilkår={vilkår}
            skalViseRedigeringsknapp={skalViseRedigeringsknapp}
            startRedigering={() => settRedigerer(true)}
            startKopiering={() => startKopiering(vilkår)}
        />
    );
};
