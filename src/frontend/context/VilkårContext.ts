import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { Vurderingsfeilmelding, Vilkårsvurderinger } from '../Sider/Behandling/vilkår';
import { Behandling } from '../typer/behandling/behandling';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Props {
    behandling: Behandling;
}

// const oppdaterVilkårsvurderingMedVilkår = (
//     vilkårsvurdering: RessursSuksess<Vilkårssett>,
//     vilkår: Vilkår
// ): RessursSuksess<Vilkårssett> => {
//     return {
//         ...vilkårsvurdering,
//         data: {
//             ...vilkårsvurdering.data,
//             vilkårsett: vilkårsvurdering.data.vilkårsett.map((tidligereVilkår) =>
//                 tidligereVilkår.id === vilkår.id ? vilkår : tidligereVilkår
//             ),
//         },
//     };
// };

export interface UseVilkår {
    vilkårsvurderinger: Ressurs<Vilkårsvurderinger>;
    hentVilkårsvurderinger: () => void;
    // oppdaterGrunnlagsdataOgHentVilkårsvurdering: (behandlingId: string) => Promise<void>;
    // lagreVilkår: (
    //     vurdering: LagreVilkårsvurdering
    // ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    feilmeldinger: Vurderingsfeilmelding;
    // nullstillVilkår: (vilkår: OppdaterVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    // ikkeVurderVilkår: (vilkår: OppdaterVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
}

export const [VilkårProvider, useVilkår] = constate(({ behandling }: Props): UseVilkår => {
    const { request } = useApp();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [feilmeldinger, settFeilmeldinger] = useState<Vurderingsfeilmelding>({});

    const [vilkårsvurderinger, settVilkårsvurderinger] =
        useState<Ressurs<Vilkårsvurderinger>>(byggTomRessurs());

    const hentVilkårsvurderinger = useCallback(() => {
        settVilkårsvurderinger(byggHenterRessurs());
        return request<Vilkårsvurderinger, void>(
            `/api/sak/vilkar/${behandling.id}/vurderinger`
        ).then(settVilkårsvurderinger);
    }, [request, behandling.id]);

    useEffect(() => {
        hentVilkårsvurderinger();
    }, [hentVilkårsvurderinger]);

    // const fjernFeilmelding = (id: string) => {
    //     settFeilmeldinger((prevFeilmeldinger) => {
    //         const prevFeilmeldingerCopy = { ...prevFeilmeldinger };
    //         delete prevFeilmeldingerCopy[id];
    //         return prevFeilmeldingerCopy;
    //     });
    // };
    //
    // const leggTilFeilmelding = (id: string, feilmelding: string) => {
    //     settFeilmeldinger((prevFeilmeldinger) => {
    //         return {
    //             ...prevFeilmeldinger,
    //             [id]: feilmelding,
    //         };
    //     });
    // };

    // TODO: Lagring
    // const lagreVilkårsvurdering = (
    //     vilkår: LagreVilkårsvurdering
    // ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
    //     return request<Vilkår, LagreVilkårsvurdering>(`/api/sak/vilkar`, 'POST', vilkår).then(
    //         (respons: RessursSuksess<Vilkår> | RessursFeilet) => {
    //             if (respons.status === RessursStatus.SUKSESS) {
    //                 fjernFeilmelding(respons.data.id);
    //                 settVilkårsvurdering((prevVilkårsvurdering) =>
    //                     oppdaterVilkårsvurderingMedVilkår(
    //                         prevVilkårsvurdering as RessursSuksess<Vilkårssett>, // prevVilkårsvurdering kan ikke være != SUKESS her
    //                         respons.data
    //                     )
    //                 );
    //             } else {
    //                 leggTilFeilmelding(vilkår.id, respons.frontendFeilmelding);
    //             }
    //             return respons;
    //         }
    //     );
    // };

    // const nullstillVilkår = (
    //     vilkår: OppdaterVilkår
    // ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
    //     return request<Vilkår, OppdaterVilkår>(`/api/sak/vilkar/nullstill`, 'POST', vilkår).then(
    //         (respons: RessursSuksess<Vilkår> | RessursFeilet) => {
    //             if (respons.status === RessursStatus.SUKSESS) {
    //                 settVilkårsvurdering((prevVilkårsvurdering) =>
    //                     oppdaterVilkårsvurderingMedVilkår(
    //                         prevVilkårsvurdering as RessursSuksess<Vilkårssett>, // prevVilkårsvurdering kan ikke være != SUKESS her
    //                         respons.data
    //                     )
    //                 );
    //             }
    //             return respons;
    //         }
    //     );
    // };
    // const ikkeVurderVilkår = (
    //     vilkår: OppdaterVilkår
    // ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
    //     return request<Vilkår, OppdaterVilkår>(`/api/sak/vilkar/ikkevurder`, 'POST', vilkår).then(
    //         (respons: RessursSuksess<Vilkår> | RessursFeilet) => {
    //             if (respons.status === RessursStatus.SUKSESS) {
    //                 settVilkårsvurdering((prevVilkårsvurdering) =>
    //                     oppdaterVilkårsvurderingMedVilkår(
    //                         prevVilkårsvurdering as RessursSuksess<Vilkårssett>, // prevVilkårsvurdering kan ikke være != SUKESS her
    //                         respons.data
    //                     )
    //                 );
    //             }
    //             return respons;
    //         }
    //     );
    // };

    // const oppdaterGrunnlagsdataOgHentVilkårsvurdering = useCallback(
    //     (behandlingId: string) =>
    //         request<Vilkårssett, void>(`/api/sak/vilkar/${behandlingId}/oppdater`).then(
    //             settVilkårsvurdering
    //         ),
    //     [request]
    // );

    return {
        vilkårsvurderinger,
        hentVilkårsvurderinger,
        // lagreVilkår: lagreVilkårsvurdering,
        feilmeldinger,
        // nullstillVilkår,
        // ikkeVurderVilkår,
        // oppdaterGrunnlagsdataOgHentVilkårsvurdering,
    };
});
