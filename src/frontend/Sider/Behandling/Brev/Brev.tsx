import React from 'react';

import styled from 'styled-components';

import Brevmeny from './Brevmeny';
import useBrev from './useBrev';
import VelgBrevmal from './VelgBrevmal';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../../komponenter/DataViewer';

const Container = styled.div`
    display: flex;
    gap: 3rem;
    justify-content: center;
    flex-direction: column;
`;

const Brev: React.FC = () => {
    const { behandling } = useBehandling();
    const { brevmaler, brevmal, settBrevmal, malStruktur } = useBrev(
        behandling.stønadstype,
        'INNVILGET'
    ); // TODO ikke bruk hardkodet resultat

    return (
        <Container>
            <DataViewer response={{ brevmaler }}>
                {({ brevmaler }) => (
                    <>
                        <VelgBrevmal
                            brevmaler={brevmaler}
                            brevmal={brevmal}
                            settBrevmal={settBrevmal}
                        />
                        <DataViewer response={{ malStruktur }}>
                            {({ malStruktur }) => (
                                <Brevmeny mal={malStruktur} behandlingId={behandling.id} />
                            )}
                        </DataViewer>
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default Brev;
