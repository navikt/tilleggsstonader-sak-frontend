import React, { useState } from 'react';

import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';

import { Alert, Loader, Pagination } from '@navikt/ds-react';

import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import DataViewer from './DataViewer';
import { Ressurs } from '../typer/ressurs';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface PdfVisningProps {
    pdfFilInnhold: Ressurs<string>;
}

const Dokument = styled(Document)`
    .react-pdf__Page__canvas {
        box-shadow:
            0 4px 4px rgba(0, 0, 0, 0.25),
            0 0 2px rgb(0 0 0 / 25%);
        margin: 0 auto;
    }

    margin: 0.5rem auto;
`;

const DokumentWrapper = styled.div`
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    align-self: flex-start;
    align-items: center;
    position: sticky;
    top: 145px;
    left: 0;
`;

const PdfVisning: React.FC<PdfVisningProps> = ({ pdfFilInnhold }) => {
    const [numPages, setNumPages] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        if (pageNumber > numPages) {
            setPageNumber(numPages);
        }
        setNumPages(numPages);
    }

    return (
        <DataViewer type={'pdf'} response={{ pdfFilInnhold }}>
            {({ pdfFilInnhold }) => (
                <DokumentWrapper>
                    <Pagination
                        page={pageNumber}
                        count={numPages}
                        onPageChange={setPageNumber}
                        size="xsmall"
                    />
                    <Dokument
                        file={`data:application/pdf;base64,${pdfFilInnhold}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={
                            <Alert variant={'error'}>Ukjent feil ved henting av dokument.</Alert>
                        }
                        noData={<Alert variant={'error'}>Dokumentet er tomt.</Alert>}
                        loading={
                            <Loader size={'xlarge'} variant="interaction" transparent={true} />
                        }
                    >
                        <Page pageNumber={pageNumber} renderTextLayer={true} />
                    </Dokument>
                    <Pagination
                        page={pageNumber}
                        count={numPages}
                        onPageChange={setPageNumber}
                        size="xsmall"
                    />
                </DokumentWrapper>
            )}
        </DataViewer>
    );
};

export default PdfVisning;
