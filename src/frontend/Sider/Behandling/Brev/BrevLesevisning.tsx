import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import PdfVisning from '../../../komponenter/PdfVisning';
import { byggTomRessurs } from '../../../typer/ressurs';

const Container = styled.div`
    display: flex;
    align-items: center;
`;

const BrevLesevisning: React.FC = () => {
    const { behandling } = useBehandling();
    const { request } = useApp();
    const [brevPdf, settBrevPdf] = useState(byggTomRessurs<string>());

    const hentBrevCallback = useCallback(() => {
        request<string, unknown>(`/api/sak/brev/${behandling.id}`).then(settBrevPdf);
    }, [request, behandling.id]);

    useEffect(hentBrevCallback, [hentBrevCallback]);

    return (
        <Container>
            <PdfVisning pdfFilInnhold={brevPdf} />;
        </Container>
    );
};

export default BrevLesevisning;
