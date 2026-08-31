import { useState } from 'react';

import constate from 'constate';

import { fjernVilkårFraListe, oppdaterVilkårIListe } from './utils';
import { Aktivitet } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { RegelstrukturReiseOppstartAvslutningHjemreise } from '../../Sider/Behandling/Stønadsvilkår/ReiseOppstartAvslutningHjemreise/typer/regelstrukturReiseOppstartAvslutningHjemreise';
import {
    LagreNyttVilkårReiseOppstartAvslutningHjemreise,
    SlettVilkårReiseOppstartAvslutningHjemreiseRequest,
    SlettVilkårReiseOppstartAvslutningHjemreiseRespons,
    VilkårReiseOppstartAvslutningHjemreise,
} from '../../Sider/Behandling/Stønadsvilkår/ReiseOppstartAvslutningHjemreise/typer/vilkårReiseOppstartAvslutningHjemreise';
import {
    RessursFeilet,
    RessursStatus,
    RessursStatusFeilet,
    RessursSuksess,
} from '../../typer/ressurs';
import { useApp } from '../AppContext';
import { useBehandling } from '../BehandlingContext';

interface Props {
    eksisterendeVilkår: VilkårReiseOppstartAvslutningHjemreise[];
    regelstruktur: RegelstrukturReiseOppstartAvslutningHjemreise;
    aktiviteter: Aktivitet[];
}

interface UseVilkårReiseOppstartAvslutningHjemreiseResponse {
    vilkårsett: VilkårReiseOppstartAvslutningHjemreise[];
    regelstruktur: RegelstrukturReiseOppstartAvslutningHjemreise;
    aktiviteter: Aktivitet[];
    lagreNyttVilkår: (
        nyttVilkår: LagreNyttVilkårReiseOppstartAvslutningHjemreise
    ) => Promise<RessursSuksess<VilkårReiseOppstartAvslutningHjemreise> | RessursFeilet>;
    oppdaterVilkår: (
        vilkårId: string,
        vilkårSomSkalOppdateres: LagreNyttVilkårReiseOppstartAvslutningHjemreise
    ) => Promise<RessursSuksess<VilkårReiseOppstartAvslutningHjemreise> | RessursFeilet>;
    slettVilkår: (
        vilkårId: string,
        slettetKommentar: string | undefined
    ) => Promise<RessursStatus.SUKSESS | RessursStatusFeilet>;
}

export const [
    VilkårReiseOppstartAvslutningHjemreiseProvider,
    useVilkårReiseOppstartAvslutningHjemreise,
] = constate(
    ({
        eksisterendeVilkår,
        regelstruktur,
        aktiviteter,
    }: Props): UseVilkårReiseOppstartAvslutningHjemreiseResponse => {
        const { request } = useApp();
        const { behandling } = useBehandling();

        const [vilkårsett, settVilkårsett] =
            useState<VilkårReiseOppstartAvslutningHjemreise[]>(eksisterendeVilkår);

        const lagreNyttVilkår = async (vilkår: LagreNyttVilkårReiseOppstartAvslutningHjemreise) => {
            const respons = await request<
                VilkårReiseOppstartAvslutningHjemreise,
                LagreNyttVilkårReiseOppstartAvslutningHjemreise
            >(
                `/api/sak/vilkar/reise-oppstart-avslutning-hjemreise/${behandling.id}`,
                'POST',
                vilkår
            );

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett((prevVilkårsvurdering) => [...prevVilkårsvurdering, respons.data]);
            }

            return respons;
        };

        const oppdaterVilkår = async (
            vilkårId: string,
            vilkår: LagreNyttVilkårReiseOppstartAvslutningHjemreise
        ) => {
            const respons = await request<
                VilkårReiseOppstartAvslutningHjemreise,
                LagreNyttVilkårReiseOppstartAvslutningHjemreise
            >(
                `/api/sak/vilkar/reise-oppstart-avslutning-hjemreise/${behandling.id}/${vilkårId}`,
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
                SlettVilkårReiseOppstartAvslutningHjemreiseRespons,
                SlettVilkårReiseOppstartAvslutningHjemreiseRequest
            >(
                `/api/sak/vilkar/reise-oppstart-avslutning-hjemreise/${behandling.id}/${vilkårId}`,
                'DELETE',
                { kommentar: slettetKommentar }
            );

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
