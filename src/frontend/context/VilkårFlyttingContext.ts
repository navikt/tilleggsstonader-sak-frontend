import { useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { useBehandling } from './BehandlingContext';
import {
    LagreVilkårFlytting,
    SlettVilkårFlyttingRespons,
    VilkårFlytting,
} from '../Sider/Behandling/Stønadsvilkår/Flytting/typer/vilkårFlytting';
import { RessursStatus } from '../typer/ressurs';

interface Props {
    eksisterendeVilkår: VilkårFlytting[];
}

export const [VilkårFlyttingProvider, useVilkårFlytting] = constate(
    ({ eksisterendeVilkår }: Props) => {
        const { request } = useApp();
        const { behandling } = useBehandling();
        const [vilkårsett, settVilkårsett] = useState(eksisterendeVilkår);

        const lagreNyttVilkår = async (vilkår: LagreVilkårFlytting) => {
            const respons = await request<VilkårFlytting, LagreVilkårFlytting>(
                `/api/sak/vilkar/flytting/${behandling.id}`,
                'POST',
                vilkår
            );

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett((tidligere) => [...tidligere, respons.data]);
            }

            return respons;
        };

        const oppdaterVilkår = async (vilkårId: string, vilkår: LagreVilkårFlytting) => {
            const respons = await request<VilkårFlytting, LagreVilkårFlytting>(
                `/api/sak/vilkar/flytting/${behandling.id}/${vilkårId}`,
                'PUT',
                vilkår
            );

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett((tidligere) =>
                    tidligere.map((eksisterende) =>
                        eksisterende.id === vilkårId ? respons.data : eksisterende
                    )
                );
            }

            return respons;
        };

        const slettVilkår = async (vilkårId: string, kommentar?: string) => {
            const respons = await request<SlettVilkårFlyttingRespons, { kommentar?: string }>(
                `/api/sak/vilkar/flytting/${behandling.id}/${vilkårId}`,
                'DELETE',
                { kommentar }
            );

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett((tidligere) =>
                    respons.data.slettetPermanent
                        ? tidligere.filter((eksisterende) => eksisterende.id !== vilkårId)
                        : tidligere.map((eksisterende) =>
                              eksisterende.id === vilkårId ? respons.data.vilkår : eksisterende
                          )
                );
            }

            return respons;
        };

        return {
            vilkårsett,
            lagreNyttVilkår,
            oppdaterVilkår,
            slettVilkår,
        };
    }
);
