import React, { useEffect } from 'react';

import styled from 'styled-components';

import BrevLesevisning from './BrevLesevisning';
import Brevmeny from './Brevmeny';
import useBrev from './useBrev';
import useMellomlagrignBrev from './useMellomlagrignBrev';
import VelgBrevmal from './VelgBrevmal';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../../komponenter/DataViewer';
import { RessursStatus } from '../../../typer/ressurs';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';

const Container = styled.div`
    display: flex;
    gap: 3rem;
    justify-content: center;
    flex-direction: column;
`;

const Brev: React.FC = () => {
    const { behandling, behandlingErRedigerbar } = useBehandling();
    const { brevmaler, brevmal, settBrevmal, malStruktur } = useBrev(
        behandling.stønadstype,
        'INNVILGET',
        behandling
    ); // TODO ikke bruk hardkodet resultat

    const { mellomlagretBrev } = useMellomlagrignBrev();

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
                            <DataViewer response={{ malStruktur }}>
                                {({ malStruktur }) => (
                                    <>
                                        <Brevmeny
                                            mal={malStruktur}
                                            behandlingId={behandling.id}
                                            mellomlagretBrev={mellomlagretBrev}
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
