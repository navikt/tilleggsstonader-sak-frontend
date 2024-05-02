import React, { useEffect } from 'react';

import styled from 'styled-components';

import BrevLesevisning from './BrevLesevisning';
import Brevmeny from './Brevmeny';
import useBrev from './useBrev';
import useMellomlagrignBrev from './useMellomlagrignBrev';
import VelgBrevmal from './VelgBrevmal';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { RessursStatus } from '../../../typer/ressurs';
import { erVedtakInnvilgelse } from '../../../typer/vedtak';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';

const Container = styled.div`
    display: flex;
    gap: 3rem;
    justify-content: center;
    flex-direction: column;
`;

const Brev: React.FC = () => {
    const { behandling, behandlingErRedigerbar } = useBehandling();
    const { brevmaler, brevmal, settBrevmal, malStruktur, fil, settFil } = useBrev(
        behandling.stønadstype,
        'INNVILGET',
        behandling
    ); // TODO ikke bruk hardkodet resultat

    const { mellomlagretBrev } = useMellomlagrignBrev();

    const { vedtak } = useVedtak();

    useEffect(() => {
        if (mellomlagretBrev.status === RessursStatus.SUKSESS) {
            settBrevmal(mellomlagretBrev.data.brevmal);
        }
    }, [mellomlagretBrev, settBrevmal]);

    return (
        <Container>
            {behandlingErRedigerbar ? (
                <DataViewer response={{ brevmaler, mellomlagretBrev }}>
                    {({ brevmaler, mellomlagretBrev }) => (
                        <>
                            <VelgBrevmal
                                brevmaler={brevmaler}
                                brevmal={brevmal}
                                settBrevmal={settBrevmal}
                            />
                            <DataViewer response={{ malStruktur, vedtak }}>
                                {({ malStruktur, vedtak }) => (
                                    <>
                                        <Brevmeny
                                            mal={malStruktur}
                                            behandlingId={behandling.id}
                                            mellomlagretBrev={mellomlagretBrev}
                                            fil={fil}
                                            settFil={settFil}
                                            beregningsresultat={
                                                erVedtakInnvilgelse(vedtak)
                                                    ? vedtak.beregningsresultat
                                                    : undefined
                                            }
                                        />
                                        <SendTilBeslutterFooter />
                                    </>
                                )}
                            </DataViewer>
                        </>
                    )}
                </DataViewer>
            ) : (
                <BrevLesevisning />
            )}
        </Container>
    );
};

export default Brev;
