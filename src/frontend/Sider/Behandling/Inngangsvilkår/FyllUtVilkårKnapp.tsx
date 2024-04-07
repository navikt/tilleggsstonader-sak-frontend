import React, { useCallback, useState } from 'react';

import { styled } from 'styled-components';

import { Button } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../context/InngangsvilkårContext';
import { useVilkår } from '../../../context/VilkårContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { RessursStatus } from '../../../typer/ressurs';

const Knapp = styled(Button)`
    width: max-content;
`;

type Vilkårtype = 'inngangsvilkår' | 'vilår';

const typeTilPath = (type: Vilkårtype): string => {
    switch (type) {
        case 'inngangsvilkår':
            return 'oppfyll-inngangsvilkar';
        case 'vilår':
            return 'oppfyll-vilkar';
        default:
            return type satisfies never;
    }
};

const FyllUtVilkårKnapp: React.FC<{ type: Vilkårtype }> = ({ type }) => {
    const { request } = useApp();
    const { hentBehandling, behandling } = useBehandling();
    const { hentStønadsperioder, hentVilkårperioder } = useInngangsvilkår();
    const { hentVilkårsvurdering } = useVilkår();

    const [feilmelding, settFeilmelding] = useState<string>();

    const hentVilkår = useCallback(() => {
        switch (type) {
            case 'inngangsvilkår':
                hentVilkårperioder.rerun();
                hentStønadsperioder.rerun();
                return;
            case 'vilår':
                hentVilkårsvurdering();
                return;
            default:
                return type satisfies never;
        }
    }, [hentStønadsperioder, hentVilkårperioder, hentVilkårsvurdering, type]);

    const automatiskFyllUtVilkår = useCallback(() => {
        request<string, null>(`/api/sak/test/${behandling.id}/${typeTilPath(type)}`, 'POST').then(
            (res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settFeilmelding(undefined);
                    hentVilkår();
                    hentBehandling.rerun();
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            }
        );
    }, [behandling, hentBehandling, hentVilkår, request, type]);

    return (
        <>
            <Knapp onClick={automatiskFyllUtVilkår}>Fyll ut vilkår automatisk</Knapp>
            <Feilmelding>{feilmelding}</Feilmelding>
        </>
    );
};

export default FyllUtVilkårKnapp;
