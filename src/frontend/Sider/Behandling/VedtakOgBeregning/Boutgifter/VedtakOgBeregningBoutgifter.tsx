import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { HGrid } from '@navikt/ds-react';

// import AvslåVedtak from './AvslåVedtak';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { RessursStatus } from '../../../../typer/ressurs';
import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import {
    VedtakBoutgifter,
    vedtakErAvslag,
    vedtakErInnvilgelse,
    vedtakErOpphør,
} from '../../../../typer/vedtak/vedtakBoutgifter';
import VelgVedtakResultat from '../Felles/VelgVedtakResultat';
import { InnvilgelseBoutgifterEllerVedtaksperioderFraForrigeBehandling } from './innvilgeVedtak/InnvilgelseBoutgifterEllerVedtaksperioderFraForrigeBehandling';
import { VarselVedtakIArena } from '../../Felles/VarselVedtakIArena';
import AvslåVedtak from '../Felles/AvslåVedtak';
import OpphørVedtak from '../Felles/Opphørsvedtak';

const Container = styled.div`
    margin: 0.5rem 2rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const VedtakOgBeregningBoutgifter: FC = () => {
    const { vedtak } = useVedtak<VedtakBoutgifter>();
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
                        <Panel tittel="Vedtak">
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
                        </Panel>

                        {typeVedtak === TypeVedtak.INNVILGELSE && (
                            <InnvilgelseBoutgifterEllerVedtaksperioderFraForrigeBehandling
                                lagretVedtak={vedtakErInnvilgelse(vedtak) ? vedtak : undefined}
                            />
                        )}
                    </Container>
                )}
            </DataViewer>
        </>
    );
};
