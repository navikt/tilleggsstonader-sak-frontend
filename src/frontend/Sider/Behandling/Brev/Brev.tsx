import React from 'react';

import styled from 'styled-components';

import Brevmeny from './Brevmeny';
import { dummybrev } from './dummybrev';
import PdfVisning from '../../../komponenter/PdfVisning';

const Container = styled.div`
    display: flex;
    flex-flow: wrap;
    gap: 3rem;
    justify-content: center;
`;

const Brev: React.FC = () => {
    return (
        <Container>
            <Brevmeny />
            <PdfVisning pdfFilInnhold={dummybrev} />
        </Container>
    );
};

export default Brev;
