import React, { useMemo } from 'react';

import styled from 'styled-components';

import { Journalpost } from '../../../typer/journalpost';

const Container = styled.div`
    flex: 1 1 auto;
`;

const PdfVisning: React.FC<{
    journalpost: Journalpost;
}> = ({ journalpost }) => {
    const dokumentMemo = useMemo(() => {
        return (
            <iframe
                title={'dokument'}
                src={`/dokument/journalpost/${journalpost.journalpostId}/dokument-pdf/${journalpost.dokumenter[0].dokumentInfoId}`}
                width={'100%'}
                height={'100%'}
            />
        );
    }, [journalpost.dokumenter, journalpost.journalpostId]);

    return <Container>{dokumentMemo}</Container>;
};

export default PdfVisning;
