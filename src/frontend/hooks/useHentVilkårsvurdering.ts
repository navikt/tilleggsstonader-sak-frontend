import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { VilkårDagligReise } from '../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';
import {
    AktivitetMedReiser,
    VilkårReiseOppstartAvslutningHjemreise,
} from '../Sider/Behandling/Stønadsvilkår/ReiseOppstartAvslutningHjemreise/typer/vilkårReiseOppstartAvslutningHjemreise';
import { VilkårReiseTilSamling } from '../Sider/Behandling/Stønadsvilkår/ReiseTilSamling/typer/vilkårReiseTilSamling';
import { Vilkårsvurdering } from '../Sider/Behandling/vilkår';
import { byggRessursSuksess, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';

export const useHentVilkårsvurdering = (): {
    hentVilkårsvurdering: (behandlingsId: string) => void;
    vilkårsvurdering: Ressurs<Vilkårsvurdering>;
} => {
    const { request } = useApp();

    const [vilkårsvurdering, settVilkårsvurdering] =
        useState<Ressurs<Vilkårsvurdering>>(byggTomRessurs());

    const hentVilkårsvurdering = useCallback(
        (behandlingId: string) => {
            return request<Vilkårsvurdering, null>(`/api/sak/vilkar/${behandlingId}`).then(
                settVilkårsvurdering
            );
        },
        [request]
    );

    return {
        hentVilkårsvurdering,
        vilkårsvurdering,
    };
};

export const useHentVilkårDagligReise = (): {
    eksisterendeVilkår: Ressurs<VilkårDagligReise[]>;
} => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [eksisterendeVilkår, settEksisterendeVilkår] =
        useState<Ressurs<VilkårDagligReise[]>>(byggTomRessurs());

    const hentEksisterendeVilkår = useCallback(() => {
        request<VilkårDagligReise[], null>(
            `/api/sak/vilkar/daglig-reise/${behandling.id}`,
            'GET'
        ).then(settEksisterendeVilkår);
    }, [request, behandling.id]);

    useEffect(() => {
        hentEksisterendeVilkår();
    }, [hentEksisterendeVilkår]);

    return {
        eksisterendeVilkår,
    };
};

export const useHentVilkårReiseTilSamling = (): {
    eksisterendeVilkår: Ressurs<VilkårReiseTilSamling[]>;
} => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [eksisterendeVilkår, settEksisterendeVilkår] =
        useState<Ressurs<VilkårReiseTilSamling[]>>(byggTomRessurs());

    const hentEksisterendeVilkår = useCallback(() => {
        request<VilkårReiseTilSamling[], null>(
            `/api/sak/vilkar/reise-til-samling/${behandling.id}`,
            'GET'
        ).then(settEksisterendeVilkår);
    }, [request, behandling.id]);

    useEffect(() => {
        hentEksisterendeVilkår();
    }, [hentEksisterendeVilkår]);

    return {
        eksisterendeVilkår,
    };
};

export const useHentVilkårReiseOppstartAvslutningHjemreise = (): {
    eksisterendeVilkår: Ressurs<VilkårReiseOppstartAvslutningHjemreise[]>;
} => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [eksisterendeVilkår, settEksisterendeVilkår] =
        useState<Ressurs<VilkårReiseOppstartAvslutningHjemreise[]>>(byggTomRessurs());

    const hentEksisterendeVilkår = useCallback(() => {
        // Backend grupperer reisene per aktivitet fra inngangsvilkår. Vi flater ut til en enkel liste her,
        // og grupperer på nytt for visning basert på aktivitetene i konteksten (samme aktivitet-data).
        request<AktivitetMedReiser[], null>(
            `/api/sak/vilkar/reise-oppstart-avslutning-hjemreise/${behandling.id}`,
            'GET'
        ).then((respons) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settEksisterendeVilkår(
                    byggRessursSuksess(respons.data.flatMap((aktivitet) => aktivitet.reiser))
                );
            } else {
                settEksisterendeVilkår(respons);
            }
        });
    }, [request, behandling.id]);

    useEffect(() => {
        hentEksisterendeVilkår();
    }, [hentEksisterendeVilkår]);

    return {
        eksisterendeVilkår,
    };
};
