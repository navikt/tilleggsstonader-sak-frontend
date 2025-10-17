import React, { FC, useState } from 'react';

import { EndreVilkårDagligReise } from './EndreVilkår/EndreVilkårDagligReise';
import LesevisningVilkårDagligReise from './Lesevisning/LesevisningVilkårDagligReise';
import { FaktaDagligReise } from './typer/faktaDagligReise';
import { SvarVilkårDagligReise, VilkårDagligReise } from './typer/vilkårDagligReise';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import { useVilkårDagligReise } from '../../../../context/VilkårDagligReiseContext/VilkårDagligReiseContext';
import { Periode } from '../../../../utils/periode';
import { PeriodeStatus } from '../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../vilkår';

interface Props {
    vilkår: VilkårDagligReise;
    vilkårIndex: number;
}

export const VisEllerEndreVilkårDagligReise: FC<Props> = ({ vilkår, vilkårIndex }) => {
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { oppdaterVilkår } = useVilkårDagligReise();

    const [redigerer, settRedigerer] = useState<boolean>(
        vilkår.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
    );

    const skalViseRedigeringsknapp = erStegRedigerbart && vilkår.status !== PeriodeStatus.SLETTET;

    const lagre = async (
        periode: Periode,
        svar: SvarVilkårDagligReise,
        fakta?: FaktaDagligReise
    ) => {
        return await oppdaterVilkår({
            id: vilkår.id,
            behandlingId: behandling.id,
            fom: periode.fom,
            tom: periode.tom,
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
            vilkårIndex={vilkårIndex}
        />
    );
};
