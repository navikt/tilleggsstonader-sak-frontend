import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { HGrid } from '@navikt/ds-react';

import AvslåVedtak from './AvslåVedtak';
import { InnvilgelseLæremidlerEllerVedtaksperioderFraForrigeBehandling } from './InnvilgeVedtak/InnvilgelseLæremidlerEllerVedtaksperioderFraForrigeBehandling';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { Steg } from '../../../../typer/behandling/steg';
import { RessursStatus } from '../../../../typer/ressurs';
import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import {
    vedtakErInnvilgelse,
    vedtakErAvslag,
    vedtakErOpphør,
    VedtakLæremidler,
} from '../../../../typer/vedtak/vedtakLæremidler';
import { Behandlingsoppsummering } from '../../Oppsummering/Behandlingsoppsummering';
import OpphørVedtak from '../Felles/Opphørsvedtak';
import VelgVedtakResultat from '../Felles/VelgVedtakResultat';

const Container = styled.div`
    margin: 1rem 2rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const VedtakOgBeregningLæremidler: FC = () => {
    const { vedtak } = useVedtak<VedtakLæremidler>();

    const [typeVedtak, settTypeVedtak] = useState<TypeVedtak | undefined>();

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settTypeVedtak(vedtak.data.type);
        }
    }, [vedtak]);

    return (
        <Container>
            <Behandlingsoppsummering steg={Steg.BEREGNE_YTELSE} />
            <DataViewer response={{ vedtak }}>
                {({ vedtak }) => (
                    <>
                        <Panel tittel="Vedtak">
                            <HGrid gap="16" columns={{ sm: 1, md: '5em auto' }}>
                                {
                                    <VelgVedtakResultat
                                        typeVedtak={typeVedtak}
                                        settTypeVedtak={settTypeVedtak}
                                    />
                                }
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
                        </Panel>

                        {typeVedtak === TypeVedtak.INNVILGELSE && (
                            <InnvilgelseLæremidlerEllerVedtaksperioderFraForrigeBehandling
                                lagretVedtak={vedtakErInnvilgelse(vedtak) ? vedtak : undefined}
                            />
                        )}
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default VedtakOgBeregningLæremidler;
