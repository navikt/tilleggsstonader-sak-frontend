import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Box, Heading, HGrid } from '@navikt/ds-react';

import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import { RessursStatus } from '../../../../typer/ressurs';
import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import {
    VedtakDagligReise,
    vedtakErAvslag,
    vedtakErInnvilgelse,
    vedtakErOpphør,
} from '../../../../typer/vedtak/vedtakDagligReise';
import { VarselVedtakIArena } from '../../Felles/VarselVedtakIArena';
import AvslåVedtak from '../Felles/AvslåVedtak';
import OpphørVedtak from '../Felles/Opphørsvedtak';
import VelgVedtakResultat from '../Felles/VelgVedtakResultat';
import { InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling } from './innvilgeVedtak/InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling';

const Container = styled.div`
    margin: 0.5rem 2rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const VedtakOgBeregningDagligReise: FC = () => {
    const { vedtak } = useVedtak<VedtakDagligReise>();
    const [typeVedtak, settTypeVedtak] = useState<TypeVedtak | undefined>();

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settTypeVedtak(vedtak.data.type);
        }
    }, [vedtak]);

    return (
        <>
            <DataViewer type={'vedtak'} response={{ vedtak }}>
                {({ vedtak }) => (
                    <Container>
                        <VarselVedtakIArena />
                        <Box padding="4" borderWidth="1" borderRadius="small">
                            <Heading size={'medium'}>Vedtak</Heading>
                            <HGrid gap="16" columns={{ sm: 1, md: '5em auto' }}>
                                <VelgVedtakResultat
                                    typeVedtak={typeVedtak}
                                    settTypeVedtak={settTypeVedtak}
                                />
                                {typeVedtak === TypeVedtak.AVSLAG && (
                                    <AvslåVedtak
                                        vedtak={vedtakErAvslag(vedtak) ? vedtak : undefined}
                                    />
                                )}
                                {typeVedtak === TypeVedtak.OPPHØR && (
                                    <OpphørVedtak
                                        vedtak={vedtakErOpphør(vedtak) ? vedtak : undefined}
                                    />
                                )}
                            </HGrid>
                        </Box>

                        {typeVedtak === TypeVedtak.INNVILGELSE && (
                            <InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling
                                lagretVedtak={vedtakErInnvilgelse(vedtak) ? vedtak : undefined}
                            />
                        )}
                    </Container>
                )}
            </DataViewer>
        </>
    );
};
