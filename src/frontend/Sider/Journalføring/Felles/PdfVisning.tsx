import React, { useMemo } from 'react';

import styled from 'styled-components';

import { JournalføringState } from '../../../hooks/useJournalføringState';

const Container = styled.div`
    flex: 1 1 auto;
`;

const PdfVisning: React.FC<{
    journalpostState: JournalføringState;
}> = ({ journalpostState }) => {
    const { journalpost, valgtDokumentPanel } = journalpostState;

    const dokumentMemo = useMemo(() => {
        return (
            <iframe
                title={'dokument'}
                src={`/dokument/journalpost/${journalpost.journalpostId}/dokument-pdf/${valgtDokumentPanel}`}
                width={'100%'}
                height={'100%'}
            />
        );
    }, [journalpost.journalpostId, valgtDokumentPanel]);

    return <Container>{dokumentMemo}</Container>;
};

export default PdfVisning;
