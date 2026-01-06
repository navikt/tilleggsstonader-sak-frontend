import React, { useState } from 'react';

import { Document, Page, pdfjs } from 'react-pdf';

import { Alert, Loader, Pagination } from '@navikt/ds-react';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import DataViewer from './DataViewer';
import styles from './PdfVisning.module.css';
import { Ressurs } from '../typer/ressurs';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface PdfVisningProps {
    pdfFilInnhold: Ressurs<string>;
}

export const PdfVisning: React.FC<PdfVisningProps> = ({ pdfFilInnhold }) => {
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
                <div className={styles.dokumentWrapper}>
                    <Pagination
                        page={pageNumber}
                        count={numPages}
                        onPageChange={setPageNumber}
                        size="xsmall"
                    />
                    <Document
                        className={styles.dokument}
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
                    </Document>
                    <Pagination
                        page={pageNumber}
                        count={numPages}
                        onPageChange={setPageNumber}
                        size="xsmall"
                    />
                </div>
            )}
        </DataViewer>
    );
};
