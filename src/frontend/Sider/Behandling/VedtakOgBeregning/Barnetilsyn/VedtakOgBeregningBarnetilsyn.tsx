import React, { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import AvslåVedtak from './AvslåVedtak';
import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { RessursStatus } from '../../../../typer/ressurs';
import { AvslagBarnetilsyn, InnvilgelseBarnetilsyn, TypeVedtak } from '../../../../typer/vedtak';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';

const Container = styled.div`
    padding: 1rem 2rem;
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
        <Container>
            <Panel tittel="Vedtak">
                <SelectVedtaksresultat
                    resultatVedtak={typeVedtak}
                    settResultatVedtak={settTypeVedtak}
                />
            </Panel>
            <DataViewer response={{ vedtak }}>
                {({ vedtak }) => {
                    switch (typeVedtak) {
                        case TypeVedtak.INNVILGET:
                            return (
                                <InnvilgeVedtak lagretVedtak={vedtak as InnvilgelseBarnetilsyn} />
                            );

                        case TypeVedtak.AVSLÅTT:
                            return <AvslåVedtak vedtak={vedtak as AvslagBarnetilsyn} />;

                        case undefined:
                            return null;

                        default:
                            return <p>Ikke implementert</p>;
                    }
                }}
            </DataViewer>
        </Container>
    );
};

export default VedtakOgBeregningBarnetilsyn;
