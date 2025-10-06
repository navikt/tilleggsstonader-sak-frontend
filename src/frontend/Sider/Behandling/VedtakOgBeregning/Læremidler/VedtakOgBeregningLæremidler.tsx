import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { HGrid } from '@navikt/ds-react';

import { InnvilgelseLæremidlerEllerVedtaksperioderFraForrigeBehandling } from './InnvilgeVedtak/InnvilgelseLæremidlerEllerVedtaksperioderFraForrigeBehandling';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { RessursStatus } from '../../../../typer/ressurs';
import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import {
    vedtakErAvslag,
    vedtakErInnvilgelse,
    vedtakErOpphør,
    VedtakLæremidler,
} from '../../../../typer/vedtak/vedtakLæremidler';
import AvslåVedtak from '../Felles/AvslåVedtak';
import OpphørVedtak from '../Felles/Opphørsvedtak';
import VelgVedtakResultat from '../Felles/VelgVedtakResultat';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
        <DataViewer type={'vedtak'} response={{ vedtak }}>
            {({ vedtak }) => (
                <Container>
                    <Panel tittel="Vedtak">
                        <HGrid gap="16" columns={{ sm: 1, md: '5em auto' }}>
                            {
                                <VelgVedtakResultat
                                    typeVedtak={typeVedtak}
                                    settTypeVedtak={settTypeVedtak}
                                />
                            }
                            {typeVedtak === TypeVedtak.AVSLAG && (
                                <AvslåVedtak vedtak={vedtakErAvslag(vedtak) ? vedtak : undefined} />
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
                </Container>
            )}
        </DataViewer>
    );
};

export default VedtakOgBeregningLæremidler;
