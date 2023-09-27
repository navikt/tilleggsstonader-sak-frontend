import React from 'react';

import styled from 'styled-components';

import Brevmeny from './Brevmeny';
import { dummybrev } from './dummybrev';
import useBrev from './useBrev';
import DataViewer from '../../../komponenter/DataViewer';
import PdfVisning from '../../../komponenter/PdfVisning';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';

const Container = styled.div`
    display: flex;
    flex-flow: wrap;
    gap: 3rem;
    justify-content: center;
`;

const Brev: React.FC = () => {
    const { brevmaler, brevmal, settBrevmal } = useBrev(Stønadstype.BARNETILSYN, 'INNVILGET');

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
