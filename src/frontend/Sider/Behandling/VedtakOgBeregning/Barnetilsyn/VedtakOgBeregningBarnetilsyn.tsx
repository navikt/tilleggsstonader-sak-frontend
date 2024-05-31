import React, { FC, useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import { HStack } from '@navikt/ds-react';

import AvslåVedtak from './AvslåVedtak/AvslåVedtak';
import { InnvilgeBarnetilsyn } from './InnvilgeVedtak/InnvilgeBarnetilsyn';
import OppsummeringVilkår from './OppsummeringVilkår';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { Ressurs, RessursStatus, byggTomRessurs } from '../../../../typer/ressurs';
import { AvslagBarnetilsyn, InnvilgelseBarnetilsyn, TypeVedtak } from '../../../../typer/vedtak';
import { Vilkårsoppsummering } from '../../../../typer/vilkårsoppsummering';
import VelgVedtakResultat from '../Felles/VelgVedtakResultat';

const Container = styled.div`
    padding: 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const Skillelinje = styled.div`
    border-left: 1px solid white;
`;

const VedtakOgBeregningBarnetilsyn: FC = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { vedtak } = useVedtak();

    const [vilkårsoppsummering, settVilkårsoppsummering] =
        useState<Ressurs<Vilkårsoppsummering>>(byggTomRessurs());
    const [typeVedtak, settTypeVedtak] = useState<TypeVedtak | undefined>();

    const hentVilkåroppsummering = useCallback(() => {
        request<Vilkårsoppsummering, null>(`/api/sak/vilkarsoppsummering/${behandling.id}`).then(
            settVilkårsoppsummering
        );
    }, [behandling.id, request]);

    useEffect(() => {
        hentVilkåroppsummering();
    }, [hentVilkåroppsummering]);

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settTypeVedtak(vedtak.data.type);
        }
    }, [vedtak]);

    return (
        <>
            <DataViewer response={{ vedtak, vilkårsoppsummering }}>
                {({ vedtak, vilkårsoppsummering }) => (
                    <Container>
                        <Panel tittel="Vedtak">
                            <HStack gap="10">
                                <OppsummeringVilkår vilkårsoppsummering={vilkårsoppsummering} />
                                <Skillelinje />
                                <HStack gap="16">
                                    <VelgVedtakResultat
                                        typeVedtak={typeVedtak}
                                        settTypeVedtak={settTypeVedtak}
                                    />
                                    {typeVedtak === TypeVedtak.AVSLAG && (
                                        <AvslåVedtak vedtak={vedtak as AvslagBarnetilsyn} />
                                    )}
                                </HStack>
                            </HStack>
                        </Panel>

                        {typeVedtak === TypeVedtak.INNVILGELSE && (
                            <InnvilgeBarnetilsyn
                                lagretVedtak={vedtak as InnvilgelseBarnetilsyn}
                                vilkårsvurderteBarn={vilkårsoppsummering.passBarn}
                            />
                        )}
                    </Container>
                )}
            </DataViewer>
        </>
    );
};

export default VedtakOgBeregningBarnetilsyn;
