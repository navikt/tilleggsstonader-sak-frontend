import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import PdfVisning from '../../../komponenter/PdfVisning';
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';
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
        const url =
            behandling.status === BehandlingStatus.FATTER_VEDTAK
                ? `/api/sak/brev/beslutter/${behandling.id}`
                : `/api/sak/brev/${behandling.id}`;

        request<string, unknown>(url).then(settBrevPdf);
    }, [behandling.status, behandling.id, request]);

    useEffect(hentBrevCallback, [hentBrevCallback]);

    return (
        <Container>
            <PdfVisning pdfFilInnhold={brevPdf} />;
        </Container>
    );
};

export default BrevLesevisning;
