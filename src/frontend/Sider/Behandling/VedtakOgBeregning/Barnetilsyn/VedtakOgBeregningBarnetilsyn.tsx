import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { HStack } from '@navikt/ds-react';

import AvslåVedtak from './AvslåVedtak/AvslåVedtak';
import { InnvilgeBarnetilsyn } from './InnvilgeVedtak/InnvilgeBarnetilsyn';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { RessursStatus } from '../../../../typer/ressurs';
import { AvslagBarnetilsyn, InnvilgelseBarnetilsyn, TypeVedtak } from '../../../../typer/vedtak';
import VelgVedtakResultat from '../Felles/VelgVedtakResultat';

const Container = styled.div`
    padding: 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const VedtakOgBeregningBarnetilsyn: FC = () => {
    const { vedtak } = useVedtak();

    const [typeVedtak, settTypeVedtak] = useState<TypeVedtak | undefined>();

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settTypeVedtak(vedtak.data.type);
        }
    }, [vedtak]);

    return (
        <>
            <DataViewer response={{ vedtak }}>
                {({ vedtak }) => (
                    <Container>
                        <Panel tittel="Vedtak">
                            <HStack gap="16">
                                <VelgVedtakResultat
                                    typeVedtak={typeVedtak}
                                    settTypeVedtak={settTypeVedtak}
                                />
                                {typeVedtak === TypeVedtak.AVSLAG && (
                                    <AvslåVedtak vedtak={vedtak as AvslagBarnetilsyn} />
                                )}
                            </HStack>
                        </Panel>

                        {typeVedtak === TypeVedtak.INNVILGELSE && (
                            <InnvilgeBarnetilsyn lagretVedtak={vedtak as InnvilgelseBarnetilsyn} />
                        )}
                    </Container>
                )}
            </DataViewer>
        </>
    );
};

export default VedtakOgBeregningBarnetilsyn;
