import { useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import {
    NyttVilkår,
    OppdaterVilkår,
    SlettVilkår,
    SlettVilkårRespons,
    SvarPåVilkår,
    Vilkår,
    Vilkårsvurdering,
} from '../Sider/Behandling/vilkår';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';

interface Props {
    hentetVilkårsvurdering: Vilkårsvurdering;
}

const oppdaterVilkårsvurderingMedVilkår = (
    vilkårsvurdering: Vilkårsvurdering,
    vilkår: Vilkår
): Vilkårsvurdering => {
    return {
        ...vilkårsvurdering,

        vilkårsett: vilkårsvurdering.vilkårsett.map((tidligereVilkår) =>
            tidligereVilkår.id === vilkår.id ? vilkår : tidligereVilkår
        ),
    };
};

const leggTilNyVilkårsvurdering = (
    eksisterendeVurderinger: Vilkårsvurdering,
    nyttVilkår: Vilkår
): Vilkårsvurdering => {
    return {
        ...eksisterendeVurderinger,
        vilkårsett: [...eksisterendeVurderinger.vilkårsett, nyttVilkår],
    };
};

const fjernVilkårFraVilkårsvurdering = (
    vilkårsvurdering: Vilkårsvurdering,
    vilkår: OppdaterVilkår
): Vilkårsvurdering => {
    return {
        ...vilkårsvurdering,

        vilkårsett: vilkårsvurdering.vilkårsett.filter(
            (tidligereVilkår) => tidligereVilkår.id !== vilkår.id
        ),
    };
};

export interface UseVilkår {
    vilkårsvurdering: Vilkårsvurdering;
    lagreNyttVilkår: (vurdering: NyttVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    lagreVilkår: (vurdering: SvarPåVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    slettVilkår: (
        vilkår: SlettVilkår
    ) => Promise<RessursSuksess<SlettVilkårRespons> | RessursFeilet>;
    ikkeVurderVilkår: (vilkår: OppdaterVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
}

export const [VilkårProvider, useVilkår] = constate(
    ({ hentetVilkårsvurdering }: Props): UseVilkår => {
        const { request } = useApp();

        const [vilkårsvurdering, settVilkårsvurdering] =
            useState<Vilkårsvurdering>(hentetVilkårsvurdering);

        const lagreVilkår = async (
            vilkår: SvarPåVilkår
        ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
            const respons = await request<Vilkår, SvarPåVilkår>(`/api/sak/vilkar`, 'POST', vilkår);
            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsvurdering((prevVilkårsvurdering) =>
                    oppdaterVilkårsvurderingMedVilkår(prevVilkårsvurdering, respons.data)
                );
            }
            return respons;
        };

        const lagreNyttVilkår = async (
            vilkår: NyttVilkår
        ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
            const respons = await request<Vilkår, NyttVilkår>(
                `/api/sak/vilkar/opprett`,
                'POST',
                vilkår
            );
            if (respons.status === RessursStatus.SUKSESS) {
                settVilkårsvurdering((prevVilkårsvurdering) =>
                    leggTilNyVilkårsvurdering(prevVilkårsvurdering, respons.data)
                );
            }
            return respons;
        };

        const slettVilkår = (
            slettVilkår: SlettVilkår
        ): Promise<RessursSuksess<SlettVilkårRespons> | RessursFeilet> => {
            return request<SlettVilkårRespons, SlettVilkår>(
                `/api/sak/vilkar`,
                'DELETE',
                slettVilkår
            ).then((respons: RessursSuksess<SlettVilkårRespons> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    if (respons.data.slettetPermanent) {
                        settVilkårsvurdering((prevVilkårsvurdering) =>
                            fjernVilkårFraVilkårsvurdering(prevVilkårsvurdering, slettVilkår)
                        );
                    } else {
                        settVilkårsvurdering((prevVilkårsvurdering) =>
                            oppdaterVilkårsvurderingMedVilkår(
                                prevVilkårsvurdering,
                                respons.data.vilkår
                            )
                        );
                    }
                }
                return respons;
            });
        };
        const ikkeVurderVilkår = (
            vilkår: OppdaterVilkår
        ): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
            return request<Vilkår, OppdaterVilkår>(
                `/api/sak/vilkar/ikkevurder`,
                'POST',
                vilkår
            ).then((respons: RessursSuksess<Vilkår> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settVilkårsvurdering((prevVilkårsvurdering) =>
                        oppdaterVilkårsvurderingMedVilkår(prevVilkårsvurdering, respons.data)
                    );
                }
                return respons;
            });
        };

        return {
            vilkårsvurdering,
            lagreVilkår,
            lagreNyttVilkår,
            slettVilkår,
            ikkeVurderVilkår,
        };
    }
);
