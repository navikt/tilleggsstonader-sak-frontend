import { useState } from 'react';

import constate from 'constate';

import { fjernVilkårFraListe, oppdaterVilkårIListe, vilkårFraAktiviteter } from './utils';
import { Aktivitet } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { RegelstrukturROAH } from '../../Sider/Behandling/Stønadsvilkår/ReiseOppstartAvslutningHjemreise/typer/regelstrukturReiseOppstartAvslutningHjemreise';
import {
    AktivitetMedReiser,
    erParaplyvilkår,
    erReise,
    LagreMidlertidigBosted,
    LagreNyttVilkårReiseOppstartAvslutningHjemreise,
    LagreVilkårROAH,
    SlettVilkårReiseOppstartAvslutningHjemreiseRequest,
    SlettVilkårReiseOppstartAvslutningHjemreiseRespons,
    VilkårMidlertidigBosted,
    VilkårROAH,
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
    eksisterendeVilkår: VilkårROAH[];
    regelstruktur: RegelstrukturROAH;
    aktiviteter: Aktivitet[];
}

type LagreRespons<T> = Promise<RessursSuksess<T> | RessursFeilet>;

interface UseVilkårReiseOppstartAvslutningHjemreiseResponse {
    reiser: VilkårReiseOppstartAvslutningHjemreise[];
    paraplyvilkår: VilkårMidlertidigBosted[];
    regelstruktur: RegelstrukturROAH;
    aktiviteter: Aktivitet[];
    lagreNyttVilkår: (
        nyttVilkår: LagreNyttVilkårReiseOppstartAvslutningHjemreise
    ) => LagreRespons<VilkårReiseOppstartAvslutningHjemreise>;
    oppdaterVilkår: (
        vilkårId: string,
        vilkårSomSkalOppdateres: LagreNyttVilkårReiseOppstartAvslutningHjemreise
    ) => LagreRespons<VilkårReiseOppstartAvslutningHjemreise>;
    lagreNyttParaplyvilkår: (
        nyttVilkår: LagreMidlertidigBosted
    ) => LagreRespons<VilkårMidlertidigBosted>;
    oppdaterParaplyvilkår: (
        vilkårId: string,
        vilkårSomSkalOppdateres: LagreMidlertidigBosted
    ) => LagreRespons<VilkårMidlertidigBosted>;
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

        const [vilkårsett, settVilkårsett] = useState<VilkårROAH[]>(eksisterendeVilkår);

        const url = `/api/sak/vilkar/reise-oppstart-avslutning-hjemreise/${behandling.id}`;

        const hentVilkårPåNytt = async () => {
            const respons = await request<AktivitetMedReiser[], null>(url, 'GET');

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett(vilkårFraAktiviteter(respons.data));
            }
        };

        const lagre = async <T extends VilkårROAH>(vilkår: LagreVilkårROAH, vilkårId?: string) => {
            const respons = await request<T, LagreVilkårROAH>(
                vilkårId ? `${url}/${vilkårId}` : url,
                vilkårId ? 'PUT' : 'POST',
                vilkår
            );

            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsett((prev) =>
                    vilkårId ? oppdaterVilkårIListe(prev, respons.data) : [...prev, respons.data]
                );
                if (vilkårId && erParaplyvilkår(respons.data)) {
                    await hentVilkårPåNytt();
                }
            }

            return respons;
        };

        const slettVilkår = async (vilkårId: string, slettetKommentar: string | undefined) => {
            const respons = await request<
                SlettVilkårReiseOppstartAvslutningHjemreiseRespons,
                SlettVilkårReiseOppstartAvslutningHjemreiseRequest
            >(`${url}/${vilkårId}`, 'DELETE', { kommentar: slettetKommentar });

            if (respons.status === RessursStatus.SUKSESS) {
                if (respons.data.slettetPermanent) {
                    settVilkårsett((prev) => fjernVilkårFraListe(prev, vilkårId));
                } else {
                    settVilkårsett((prev) => oppdaterVilkårIListe(prev, respons.data.vilkår));
                }
                if (erParaplyvilkår(respons.data.vilkår)) {
                    await hentVilkårPåNytt();
                }
            }

            return respons.status;
        };

        return {
            reiser: vilkårsett.filter(erReise),
            paraplyvilkår: vilkårsett.filter(erParaplyvilkår),
            regelstruktur,
            aktiviteter,
            lagreNyttVilkår: (vilkår) => lagre<VilkårReiseOppstartAvslutningHjemreise>(vilkår),
            oppdaterVilkår: (vilkårId, vilkår) =>
                lagre<VilkårReiseOppstartAvslutningHjemreise>(vilkår, vilkårId),
            lagreNyttParaplyvilkår: (vilkår) => lagre<VilkårMidlertidigBosted>(vilkår),
            oppdaterParaplyvilkår: (vilkårId, vilkår) =>
                lagre<VilkårMidlertidigBosted>(vilkår, vilkårId),
            slettVilkår,
        };
    }
);
