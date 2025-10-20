import { useState } from 'react';

import constate from 'constate';

import {
    LagreNyttVilkårDagligReise,
    SlettVilkårDagligReiseRequest,
    SlettVilkårDagligReiseRespons,
    VilkårDagligReise,
} from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';
import {
    RessursFeilet,
    RessursStatus,
    RessursStatusFeilet,
    RessursSuksess,
} from '../../typer/ressurs';
import { useApp } from '../AppContext';
import { fjernFraListe, oppdaterVilkårIListe } from './utils';
import { Regelstruktur } from '../../Sider/Behandling/Stønadsvilkår/DagligReise/typer/regelstrukturDagligReise';
import { useBehandling } from '../BehandlingContext';

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
        vilkårId: string,
        vilkårSomSkalOppdateres: LagreNyttVilkårDagligReise
    ) => Promise<RessursSuksess<VilkårDagligReise> | RessursFeilet>;
    slettVilkår: (
        vilkårId: string,
        slettetKommentar: string | undefined
    ) => Promise<RessursStatus.SUKSESS | RessursStatusFeilet>;
}

export const [VilkårDagligReiseProvider, useVilkårDagligReise] = constate(
    ({ eksisterendeVilkår, regelstruktur }: Props): UseVilkårDagligReiseResponse => {
        const { request } = useApp();
        const { behandling } = useBehandling();

        const [vilkårsett, settVilkårsett] = useState<VilkårDagligReise[]>(eksisterendeVilkår);

        const lagreNyttVilkår = async (vilkår: LagreNyttVilkårDagligReise) => {
            const respons = await request<VilkårDagligReise, LagreNyttVilkårDagligReise>(
                `/api/sak/vilkar/daglig-reise/${behandling.id}`,
                'POST',
                vilkår
            );

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett((prevVilkårsvurdering) => [...prevVilkårsvurdering, respons.data]);
            }

            return respons;
        };

        const oppdaterVilkår = async (vilkårId: string, vilkår: LagreNyttVilkårDagligReise) => {
            const respons = await request<VilkårDagligReise, LagreNyttVilkårDagligReise>(
                `/api/sak/vilkar/daglig-reise/${behandling.id}/${vilkårId}`,
                'PUT',
                vilkår
            );

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett((prevVilkårsvurdering) =>
                    oppdaterVilkårIListe(prevVilkårsvurdering, respons.data)
                );
            }

            return respons;
        };

        const slettVilkår = async (vilkårId: string, slettetKommentar: string | undefined) => {
            const respons = await request<
                SlettVilkårDagligReiseRespons,
                SlettVilkårDagligReiseRequest
            >(`/api/sak/vilkar/daglig-reise/${behandling.id}/${vilkårId}`, 'DELETE', {
                kommentar: slettetKommentar,
            });

            if (respons.status === RessursStatus.SUKSESS) {
                if (respons.data.slettetPermanent) {
                    settVilkårsett((prevVilkårsvurdering) =>
                        fjernFraListe(prevVilkårsvurdering, vilkårId)
                    );
                } else {
                    settVilkårsett((prevVilkårsvurdering) =>
                        oppdaterVilkårIListe(prevVilkårsvurdering, respons.data.vilkår)
                    );
                }
            }

            return respons.status;
        };

        return {
            vilkårsett,
            regelstruktur,
            lagreNyttVilkår,
            oppdaterVilkår,
            slettVilkår,
        };
    }
);
