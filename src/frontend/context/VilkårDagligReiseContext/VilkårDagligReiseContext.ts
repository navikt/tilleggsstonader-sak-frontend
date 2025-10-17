import { useState } from 'react';

import constate from 'constate';

import {
    LagreNyttVilkårDagligReise,
    OppdaterVilkårDagligReise,
    VilkårDagligReise,
} from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../typer/ressurs';
import { useApp } from '../AppContext';
import { oppdaterVilkårIListe } from './utils';
import { Regelstruktur } from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/regelstrukturDagligReise';

interface Props {
    eksisterendeVilkår: VilkårDagligReise[];
    regelstruktur: Regelstruktur;
}

interface UseVilkårDagligReiseResponse {
    vilkårsett: VilkårDagligReise[];
    regelstruktur: Regelstruktur;
    lagreNyttVilkår: (
        nyttVilkår: LagreNyttVilkårDagligReise
    ) => Promise<RessursSuksess<VilkårDagligReise> | RessursFeilet>;
    oppdaterVilkår: (
        vilkårSomSkalOppdateres: OppdaterVilkårDagligReise
    ) => Promise<RessursSuksess<VilkårDagligReise> | RessursFeilet>;
}

export const [VilkårDagligReiseProvider, useVilkårDagligReise] = constate(
    ({ eksisterendeVilkår, regelstruktur }: Props): UseVilkårDagligReiseResponse => {
        const { request } = useApp();

        const [vilkårsett, settVilkårsett] = useState<VilkårDagligReise[]>(eksisterendeVilkår);

        const lagreNyttVilkår = async (vilkår: LagreNyttVilkårDagligReise) => {
            const respons = await request<VilkårDagligReise, LagreNyttVilkårDagligReise>(
                `/api/sak/vilkar/daglig-reise/opprett`,
                'POST',
                vilkår
            );

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett((prevVilkårsvurdering) => [...prevVilkårsvurdering, respons.data]);
            }

            return respons;
        };

        const oppdaterVilkår = async (vilkår: OppdaterVilkårDagligReise) => {
            const respons = await request<VilkårDagligReise, OppdaterVilkårDagligReise>(
                `/api/sak/vilkar/daglig-reise/oppdater`,
                'POST',
                vilkår
            );

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett((prevVilkårsvurdering) =>
                    oppdaterVilkårIListe(prevVilkårsvurdering, respons.data)
                );
            }

            return respons;
        };

        return {
            vilkårsett,
            regelstruktur,
            lagreNyttVilkår,
            oppdaterVilkår,
        };
    }
);
