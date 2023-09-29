import React from 'react';

import styled from 'styled-components';

import Brevmeny from './Brevmeny';
import { dummybrev } from './dummybrev';
import useBrev from './useBrev';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../../komponenter/DataViewer';
import PdfVisning from '../../../komponenter/PdfVisning';

const Container = styled.div`
    display: flex;
    flex-flow: wrap;
    gap: 3rem;
    justify-content: center;
`;

const Brev: React.FC = () => {
    const { behandling } = useBehandling();
    const { brevmaler, brevmal, settBrevmal } = useBrev(behandling.stønadstype, 'INNVILGET'); // TODO

    return (
        <Container>
            <DataViewer response={{ brevmaler }}>
                {({ brevmaler }) => (
                    <Brevmeny brevmaler={brevmaler} brevmal={brevmal} settBrevmal={settBrevmal} />
                )}
            </DataViewer>
            <PdfVisning pdfFilInnhold={dummybrev} />
        </Container>
    );
};

export default Brev;
