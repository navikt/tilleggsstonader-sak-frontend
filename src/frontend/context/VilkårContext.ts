import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { Vilkår, Vilkårsvurdering } from '../Sider/Behandling/vilkår';
import { OppdaterVilkårsvurdering } from '../Sider/Behandling/Vilkårvurdering/oppdatering';
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
    vilkårsvurdering: RessursSuksess<Vilkårsvurdering>,
    vilkår: Vilkår
): RessursSuksess<Vilkårsvurdering> => {
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
    vilkårsvurdering: Ressurs<Vilkårsvurdering>;
    hentVilkårsvurdering: () => void;
    oppdaterGrunnlagsdataOgHentVilkårsvurdering: (behandlingId: string) => Promise<void>;
    lagreVilkårsvurdering: (
        vurdering: OppdaterVilkårsvurdering
    ) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    feilmeldinger: Vurderingsfeilmelding;
    nullstillVilkår: (vilkår: OppdaterVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    ikkeVurderVilkår: (vilkår: OppdaterVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
}

export const [VilkårProvider, useVilkår] = constate(({ behandling }: Props): UseVilkår => {
    const { request } = useApp();

    const [feilmeldinger, settFeilmeldinger] = useState<Vurderingsfeilmelding>({});

    const [vilkårsvurdering, settVilkårsvurdering] =
        useState<Ressurs<Vilkårsvurdering>>(byggTomRessurs());

    const hentVilkårsvurdering = useCallback(() => {
        settVilkårsvurdering(byggHenterRessurs());
        return request<Vilkårsvurdering, void>(`/api/sak/vilkar/${behandling.id}/vurderinger`).then(
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
        lagreVilkårsvurdering: OppdaterVilkårsvurdering
    ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
        return request<Vilkår, OppdaterVilkårsvurdering>(
            `/api/sak/vilkar/oppdater`,
            'POST',
            lagreVilkårsvurdering
        ).then((respons: RessursSuksess<Vilkår> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                fjernFeilmelding(respons.data.id);
                settVilkårsvurdering((prevVilkårsvurdering) =>
                    oppdaterVilkårsvurderingMedVilkår(
                        prevVilkårsvurdering as RessursSuksess<Vilkårsvurdering>, // prevVilkårsvurdering kan ikke være != SUKESS her
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
                    settVilkårsvurdering((prevVilkårsvurdering) =>
                        oppdaterVilkårsvurderingMedVilkår(
                            prevVilkårsvurdering as RessursSuksess<Vilkårsvurdering>, // prevVilkårsvurdering kan ikke være != SUKESS her
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
                            prevVilkårsvurdering as RessursSuksess<Vilkårsvurdering>, // prevVilkårsvurdering kan ikke være != SUKESS her
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
            request<Vilkårsvurdering, void>(`/api/sak/vilkar/${behandlingId}/oppdater`).then(
                settVilkårsvurdering
            ),
        [request]
    );

    return {
        vilkårsvurdering: vilkårsvurdering,
        hentVilkårsvurdering: hentVilkårsvurdering,
        lagreVilkårsvurdering,
        feilmeldinger,
        nullstillVilkår,
        ikkeVurderVilkår,
        oppdaterGrunnlagsdataOgHentVilkårsvurdering,
    };
});

type OppdaterVilkår = Pick<Vilkår, 'id' | 'behandlingId'>;

interface Vurderingsfeilmelding {
    [Key: string]: string;
}
