import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import {
    OppdaterVilkår,
    LagreVilkårsvurdering,
    Vilkår,
    Vilkårssett,
    Vurderingsfeilmelding,
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
    vilkårsvurdering: RessursSuksess<Vilkårssett>,
    vilkår: Vilkår
): RessursSuksess<Vilkårssett> => {
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
    vilkårsvurdering: Ressurs<Vilkårssett>;
    hentVilkårsvurdering: () => void;
    oppdaterGrunnlagsdataOgHentVilkårsvurdering: (behandlingId: string) => Promise<void>;
    lagreVilkår: (
        vurdering: LagreVilkårsvurdering
    ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    feilmeldinger: Vurderingsfeilmelding;
    nullstillVilkår: (vilkår: OppdaterVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    ikkeVurderVilkår: (vilkår: OppdaterVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
}

export const [VilkårProvider, useVilkår] = constate(({ behandling }: Props): UseVilkår => {
    const { request } = useApp();

    const [feilmeldinger, settFeilmeldinger] = useState<Vurderingsfeilmelding>({});

    const [vilkårsvurdering, settVilkårsvurdering] =
        useState<Ressurs<Vilkårssett>>(byggTomRessurs());

    const hentVilkårsvurdering = useCallback(() => {
        settVilkårsvurdering(byggHenterRessurs());
        return request<Vilkårssett, void>(`/api/sak/vilkar/${behandling.id}`).then(
            settVilkårsvurdering
        );
    }, [request, behandling.id]);

    useEffect(() => {
        hentVilkårsvurdering();
    }, [hentVilkårsvurdering]);

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
        vilkår: LagreVilkårsvurdering
    ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
        return request<Vilkår, LagreVilkårsvurdering>(`/api/sak/vilkar`, 'POST', vilkår).then(
            (respons: RessursSuksess<Vilkår> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    fjernFeilmelding(respons.data.id);
                    settVilkårsvurdering((prevVilkårsvurdering) =>
                        oppdaterVilkårsvurderingMedVilkår(
                            prevVilkårsvurdering as RessursSuksess<Vilkårssett>, // prevVilkårsvurdering kan ikke være != SUKESS her
                            respons.data
                        )
                    );
                } else {
                    leggTilFeilmelding(vilkår.id, respons.frontendFeilmelding);
                }
                return respons;
            }
        );
    };

    const nullstillVilkår = (
        vilkår: OppdaterVilkår
    ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
        return request<Vilkår, OppdaterVilkår>(`/api/sak/vilkar/nullstill`, 'POST', vilkår).then(
            (respons: RessursSuksess<Vilkår> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settVilkårsvurdering((prevVilkårsvurdering) =>
                        oppdaterVilkårsvurderingMedVilkår(
                            prevVilkårsvurdering as RessursSuksess<Vilkårssett>, // prevVilkårsvurdering kan ikke være != SUKESS her
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
                    settVilkårsvurdering((prevVilkårsvurdering) =>
                        oppdaterVilkårsvurderingMedVilkår(
                            prevVilkårsvurdering as RessursSuksess<Vilkårssett>, // prevVilkårsvurdering kan ikke være != SUKESS her
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
            request<Vilkårssett, void>(`/api/sak/vilkar/${behandlingId}/oppdater`).then(
                settVilkårsvurdering
            ),
        [request]
    );

    return {
        vilkårsvurdering,
        hentVilkårsvurdering,
        lagreVilkår: lagreVilkårsvurdering,
        feilmeldinger,
        nullstillVilkår,
        ikkeVurderVilkår,
        oppdaterGrunnlagsdataOgHentVilkårsvurdering,
    };
});
