import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import {
    OppdaterVilkår,
    LagreVilkårsvurdering,
    Vilkår,
    Vurderingsfeilmelding,
    Vilkårsvurderinger,
} from '../Sider/Behandling/vilkår';
import { Behandling } from '../typer/behandling/behandling';
import {
    byggHenterRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';

interface Props {
    behandling: Behandling;
}

const oppdaterVilkårsvurderingMedVilkår = (
    vilkårsvurdering: RessursSuksess<Vilkårsvurderinger>,
    vilkår: Vilkår
): RessursSuksess<Vilkårsvurderinger> => {
    return {
        ...vilkårsvurdering,
        data: {
            ...vilkårsvurdering.data,
            vilkårsett: vilkårsvurdering.data.vilkårsett.map((tidligereVilkår) =>
                tidligereVilkår.id === vilkår.id ? vilkår : tidligereVilkår
            ),
        },
    };
};

export interface UseVilkår {
    vilkårsvurderinger: Ressurs<Vilkårsvurderinger>;
    hentVilkårsvurderinger: () => void;
    oppdaterGrunnlagsdataOgHentVilkårsvurdering: (behandlingId: string) => Promise<void>;
    lagreVilkårsvurdering: (
        vurdering: LagreVilkårsvurdering
    ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    feilmeldinger: Vurderingsfeilmelding;
    nullstillVilkår: (vilkår: OppdaterVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    ikkeVurderVilkår: (vilkår: OppdaterVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
}

export const [VilkårProvider, useVilkår] = constate(({ behandling }: Props): UseVilkår => {
    const { request } = useApp();

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

    const fjernFeilmelding = (id: string) => {
        settFeilmeldinger((prevFeilmeldinger) => {
            const prevFeilmeldingerCopy = { ...prevFeilmeldinger };
            delete prevFeilmeldingerCopy[id];
            return prevFeilmeldingerCopy;
        });
    };

    const leggTilFeilmelding = (id: string, feilmelding: string) => {
        settFeilmeldinger((prevFeilmeldinger) => {
            return {
                ...prevFeilmeldinger,
                [id]: feilmelding,
            };
        });
    };

    const lagreVilkårsvurdering = (
        lagreVilkårsvurdering: LagreVilkårsvurdering
    ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
        return request<Vilkår, LagreVilkårsvurdering>(
            `/api/sak/vilkar/oppdater`,
            'POST',
            lagreVilkårsvurdering
        ).then((respons: RessursSuksess<Vilkår> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                fjernFeilmelding(respons.data.id);
                settVilkårsvurderinger((prevVilkårsvurdering) =>
                    oppdaterVilkårsvurderingMedVilkår(
                        prevVilkårsvurdering as RessursSuksess<Vilkårsvurderinger>, // prevVilkårsvurdering kan ikke være != SUKESS her
                        respons.data
                    )
                );
            } else {
                leggTilFeilmelding(lagreVilkårsvurdering.id, respons.frontendFeilmelding);
            }
            return respons;
        });
    };

    const nullstillVilkår = (
        vilkår: OppdaterVilkår
    ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
        return request<Vilkår, OppdaterVilkår>(`/api/sak/vilkar/nullstill`, 'POST', vilkår).then(
            (respons: RessursSuksess<Vilkår> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settVilkårsvurderinger((prevVilkårsvurdering) =>
                        oppdaterVilkårsvurderingMedVilkår(
                            prevVilkårsvurdering as RessursSuksess<Vilkårsvurderinger>, // prevVilkårsvurdering kan ikke være != SUKESS her
                            respons.data
                        )
                    );
                }
                return respons;
            }
        );
    };
    const ikkeVurderVilkår = (
        vilkår: OppdaterVilkår
    ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
        return request<Vilkår, OppdaterVilkår>(`/api/sak/vilkar/ikkevurder`, 'POST', vilkår).then(
            (respons: RessursSuksess<Vilkår> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settVilkårsvurderinger((prevVilkårsvurdering) =>
                        oppdaterVilkårsvurderingMedVilkår(
                            prevVilkårsvurdering as RessursSuksess<Vilkårsvurderinger>, // prevVilkårsvurdering kan ikke være != SUKESS her
                            respons.data
                        )
                    );
                }
                return respons;
            }
        );
    };

    const oppdaterGrunnlagsdataOgHentVilkårsvurdering = useCallback(
        (behandlingId: string) =>
            request<Vilkårsvurderinger, void>(`/api/sak/vilkar/${behandlingId}/oppdater`).then(
                settVilkårsvurderinger
            ),
        [request]
    );

    return {
        vilkårsvurderinger,
        hentVilkårsvurderinger,
        lagreVilkårsvurdering,
        feilmeldinger,
        nullstillVilkår,
        ikkeVurderVilkår,
        oppdaterGrunnlagsdataOgHentVilkårsvurdering,
    };
});
