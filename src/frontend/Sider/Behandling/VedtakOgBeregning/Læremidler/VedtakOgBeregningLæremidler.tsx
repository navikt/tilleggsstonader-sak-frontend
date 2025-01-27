import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { HGrid } from '@navikt/ds-react';

import AvslåVedtak from './AvslåVedtak';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { RessursStatus } from '../../../../typer/ressurs';
import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import {
    AvslagLæremidler,
    InnvilgelseLæremidler,
    OpphørLæremidler,
    VedtakLæremidler,
} from '../../../../typer/vedtak/vedtakLæremidler';
import VelgVedtakResultat from '../Felles/VelgVedtakResultat';
import OpphørVedtak from '../Læremidler/OpphørVedtak';
import { InnvilgelseLæremidlerEllerVedtaksperioderFraForrigeBehandling } from './InnvilgeVedtak/InnvilgelseLæremidlerEllerVedtaksperioderFraForrigeBehandling';

const Container = styled.div`
    padding: 2rem 2rem;
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
        <DataViewer response={{ vedtak }}>
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
                                <AvslåVedtak vedtak={vedtak as AvslagLæremidler} />
                            )}
                            {typeVedtak === TypeVedtak.OPPHØR && (
                                <OpphørVedtak vedtak={vedtak as OpphørLæremidler} />
                            )}
                        </HGrid>
                    </Panel>

                    {typeVedtak === TypeVedtak.INNVILGELSE && (
                        <InnvilgelseLæremidlerEllerVedtaksperioderFraForrigeBehandling
                            lagretVedtak={vedtak as InnvilgelseLæremidler}
                        />
                    )}
                </Container>
            )}
        </DataViewer>
    );
};

export default VedtakOgBeregningLæremidler;
