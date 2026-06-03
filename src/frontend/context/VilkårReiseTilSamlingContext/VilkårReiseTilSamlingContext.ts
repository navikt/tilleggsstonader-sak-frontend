import { useState } from 'react';

import constate from 'constate';

import { fjernVilkårFraListe, oppdaterVilkårIListe } from './utils';
import { Aktivitet } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { RegelstrukturReiseTilSamling } from '../../Sider/Behandling/Stønadsvilkår/ReiseTilSamling/typer/regelstrukturReiseTilSamling';
import {
    LagreNyttVilkårReiseTilSamling,
    SlettVilkårReiseTilSamlingRequest,
    SlettVilkårReiseTilSamlingRespons,
    VilkårReiseTilSamling,
} from '../../Sider/Behandling/Stønadsvilkår/ReiseTilSamling/typer/vilkårReiseTilSamling';
import {
    RessursFeilet,
    RessursStatus,
    RessursStatusFeilet,
    RessursSuksess,
} from '../../typer/ressurs';
import { useApp } from '../AppContext';
import { useBehandling } from '../BehandlingContext';

interface Props {
    eksisterendeVilkår: VilkårReiseTilSamling[];
    regelstruktur: RegelstrukturReiseTilSamling;
    aktiviteter: Aktivitet[];
}

interface UseVilkårReiseTilSamlingResponse {
    vilkårsett: VilkårReiseTilSamling[];
    regelstruktur: RegelstrukturReiseTilSamling;
    aktiviteter: Aktivitet[];
    lagreNyttVilkår: (
        nyttVilkår: LagreNyttVilkårReiseTilSamling
    ) => Promise<RessursSuksess<VilkårReiseTilSamling> | RessursFeilet>;
    oppdaterVilkår: (
        vilkårId: string,
        vilkårSomSkalOppdateres: LagreNyttVilkårReiseTilSamling
    ) => Promise<RessursSuksess<VilkårReiseTilSamling> | RessursFeilet>;
    slettVilkår: (
        vilkårId: string,
        slettetKommentar: string | undefined
    ) => Promise<RessursStatus.SUKSESS | RessursStatusFeilet>;
}

export const [VilkårReiseTilSamlingProvider, useVilkårReiseTilSamling] = constate(
    ({
        eksisterendeVilkår,
        regelstruktur,
        aktiviteter,
    }: Props): UseVilkårReiseTilSamlingResponse => {
        const { request } = useApp();
        const { behandling } = useBehandling();

        const [vilkårsett, settVilkårsett] = useState<VilkårReiseTilSamling[]>(eksisterendeVilkår);

        const lagreNyttVilkår = async (vilkår: LagreNyttVilkårReiseTilSamling) => {
            const respons = await request<VilkårReiseTilSamling, LagreNyttVilkårReiseTilSamling>(
                `/api/sak/vilkar/reise-til-samling/${behandling.id}`,
                'POST',
                vilkår
            );

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett((prevVilkårsvurdering) => [...prevVilkårsvurdering, respons.data]);
            }

            return respons;
        };

        const oppdaterVilkår = async (vilkårId: string, vilkår: LagreNyttVilkårReiseTilSamling) => {
            const respons = await request<VilkårReiseTilSamling, LagreNyttVilkårReiseTilSamling>(
                `/api/sak/vilkar/reise-til-samling/${behandling.id}/${vilkårId}`,
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
                SlettVilkårReiseTilSamlingRespons,
                SlettVilkårReiseTilSamlingRequest
            >(`/api/sak/vilkar/reise-til-samling/${behandling.id}/${vilkårId}`, 'DELETE', {
                kommentar: slettetKommentar,
            });

            if (respons.status === RessursStatus.SUKSESS) {
                if (respons.data.slettetPermanent) {
                    settVilkårsett((prevVilkårsvurdering) =>
                        fjernVilkårFraListe(prevVilkårsvurdering, vilkårId)
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
            aktiviteter,
            lagreNyttVilkår,
            oppdaterVilkår,
            slettVilkår,
        };
    }
);
