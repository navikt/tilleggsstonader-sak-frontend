import React, { SetStateAction, useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { useBehandling } from './BehandlingContext';
import { Aktivitet, Målgruppe, Vilkårperioder } from '../Sider/Behandling/Inngangsvilkår/typer';
import { SvarPåVilkår, Vilkår, Vurderingsfeilmelding } from '../Sider/Behandling/vilkår';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';

type RadState = 'åpen';
interface RaderState {
    [key: string]: RadState;
}

export interface UseInngangsvilkår {
    vilkårperioder: Ressurs<Vilkårperioder>;
    leggTilMålgruppe: (nyPeriode: Målgruppe) => void;
    leggTilAktivitet: (nyPeriode: Aktivitet) => void;
    lagreVilkår: (vilkår: SvarPåVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    oppdaterMålgruppeVilkårState: (svarPåVilkår: SvarPåVilkår) => void;
    oppdaterAktivitetVilkårState: (svarPåVilkår: SvarPåVilkår) => void;
    vilkårFeilmeldinger: Vurderingsfeilmelding;
    målgrupperader: RaderState;
    oppdaterMålgrupperad: (id: string, state: RadState | undefined) => void;
    aktivitetsrader: RaderState;
    oppdaterAktivitetsrad: (id: string, state: RadState | undefined) => void;
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate((): UseInngangsvilkår => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [målgrupperader, settMålgrupperader] = useState<RaderState>({});
    const [aktivitetsrader, settAktivitetsrader] = useState<RaderState>({});

    const [vilkårperioder, settVilkårperioder] =
        useState<Ressurs<Vilkårperioder>>(byggTomRessurs());

    const [vilkårFeilmeldinger, settVilkårfeilmeldinger] = useState<Vurderingsfeilmelding>({});

    const hentVilkårperioder = useCallback(
        (behandlingId: string) => {
            return request<Vilkårperioder, null>(`/api/sak/vilkar/${behandlingId}/periode`).then(
                settVilkårperioder
            );
        },
        [request]
    );

    useEffect(() => {
        hentVilkårperioder(behandling.id);
    }, [hentVilkårperioder, behandling.id]);

    const oppdaterMålgrupperad = (id: string, state: RadState | undefined) =>
        oppdaterRadState(settMålgrupperader, id, state);

    const oppdaterAktivitetsrad = (id: string, state: RadState | undefined) =>
        oppdaterRadState(settAktivitetsrader, id, state);

    const leggTilMålgruppe = (nyPeriode: Målgruppe) => {
        settVilkårperioder((prevState) =>
            oppdaterVilkårsperioderMedNyMålgruppe(
                prevState as RessursSuksess<Vilkårperioder>,
                nyPeriode
            )
        );
    };

    const leggTilAktivitet = (nyPeriode: Aktivitet) => {
        settVilkårperioder((prevState) =>
            oppdaterVilkårsperioderMedNyAktivitet(
                prevState as RessursSuksess<Vilkårperioder>,
                nyPeriode
            )
        );
    };

    const lagreVilkår = (vilkår: SvarPåVilkår): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
        return request<Vilkår, SvarPåVilkår>(`/api/sak/vilkar`, 'POST', vilkår);
    };

    const oppdaterMålgruppeVilkårState = (svarPåVilkår: SvarPåVilkår) => {
        lagreVilkår(svarPåVilkår).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVilkårperioder((prevState) =>
                    oppdaterMålgruppeVilkår(prevState as RessursSuksess<Vilkårperioder>, res.data)
                );
                oppdaterMålgrupperad(svarPåVilkår.id, undefined);
            } else {
                settVilkårfeilmeldinger((prevState) => ({
                    ...prevState,
                    [svarPåVilkår.id]: res.frontendFeilmelding,
                }));
            }
        });
    };

    const oppdaterAktivitetVilkårState = (svarPåVilkår: SvarPåVilkår) => {
        lagreVilkår(svarPåVilkår).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVilkårperioder((prevState) =>
                    oppdaterAktivitetVilkår(prevState as RessursSuksess<Vilkårperioder>, res.data)
                );
                oppdaterAktivitetsrad(svarPåVilkår.id, undefined);
            } else {
                settVilkårfeilmeldinger((prevState) => ({
                    ...prevState,
                    [svarPåVilkår.id]: res.frontendFeilmelding,
                }));
            }
        });
    };

    return {
        vilkårperioder,
        leggTilMålgruppe,
        leggTilAktivitet,
        lagreVilkår,
        oppdaterMålgruppeVilkårState,
        oppdaterAktivitetVilkårState,
        vilkårFeilmeldinger,
        målgrupperader,
        oppdaterMålgrupperad,
        aktivitetsrader,
        oppdaterAktivitetsrad,
    };
});

const oppdaterRadState = (
    dispatch: React.Dispatch<SetStateAction<RaderState>>,
    id: string,
    state: RadState | undefined
) => {
    dispatch((prevState) => {
        if (!state) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _, ...rest } = prevState;
            return rest;
        } else {
            return {
                ...prevState,
                [id]: 'åpen',
            };
        }
    });
};

const oppdaterVilkårsperioderMedNyMålgruppe = (
    vilkårperioder: RessursSuksess<Vilkårperioder>,
    nyPeriode: Målgruppe
) => {
    return {
        ...vilkårperioder,
        data: {
            ...vilkårperioder.data,
            målgrupper: [...vilkårperioder.data.målgrupper, nyPeriode],
        },
    };
};

const oppdaterVilkårsperioderMedNyAktivitet = (
    vilkårperioder: RessursSuksess<Vilkårperioder>,
    nyPeriode: Aktivitet
) => {
    return {
        ...vilkårperioder,
        data: {
            ...vilkårperioder.data,
            aktiviteter: [...vilkårperioder.data.aktiviteter, nyPeriode],
        },
    };
};

const oppdaterMålgruppeVilkår = (
    vilkårperioder: RessursSuksess<Vilkårperioder>,
    vilkår: Vilkår
): RessursSuksess<Vilkårperioder> => {
    return {
        ...vilkårperioder,
        data: {
            ...vilkårperioder.data,
            målgrupper: vilkårperioder.data.målgrupper.map((prevState) =>
                prevState.vilkår.id === vilkår.id ? { ...prevState, vilkår: vilkår } : prevState
            ),
        },
    };
};

const oppdaterAktivitetVilkår = (
    vilkårperioder: RessursSuksess<Vilkårperioder>,
    vilkår: Vilkår
): RessursSuksess<Vilkårperioder> => {
    return {
        ...vilkårperioder,
        data: {
            ...vilkårperioder.data,
            aktiviteter: vilkårperioder.data.aktiviteter.map((prevState) =>
                prevState.vilkår.id === vilkår.id ? { ...prevState, vilkår: vilkår } : prevState
            ),
        },
    };
};
