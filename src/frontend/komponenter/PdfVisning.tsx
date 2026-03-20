import React, { useEffect, useMemo } from 'react';

import { BrevSkeleton } from './BrevSkeleton';
import DataViewer from './DataViewer';
import styles from './PdfVisning.module.css';
import { Ressurs, RessursStatus } from '../typer/ressurs';

interface PdfVisningProps {
    pdfFilInnhold: Ressurs<string>;
}

const Base64PdfIframe: React.FC<{ base64: string }> = ({ base64 }) => {
    const blobUrl = useMemo(() => {
        const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        return `${URL.createObjectURL(blob)}#navpanes=0`;
    }, [base64]);

    useEffect(() => {
        const rawUrl = blobUrl.split('#')[0];
        return () => URL.revokeObjectURL(rawUrl);
    }, [blobUrl]);

    return <iframe className={styles.pdfIframe} title="brev" src={blobUrl} />;
};

export const PdfVisning: React.FC<PdfVisningProps> = ({ pdfFilInnhold }) => {
    const brevLasterInn =
        pdfFilInnhold.status === RessursStatus.HENTER ||
        pdfFilInnhold.status === RessursStatus.IKKE_HENTET;

    return brevLasterInn ? (
        <div className={styles.dokumentWrapper}>
            <BrevSkeleton />
        </div>
    ) : (
        <DataViewer type="pdf" response={{ pdfFilInnhold }}>
            {({ pdfFilInnhold }) => (
                <div className={styles.dokumentWrapper}>
                    <Base64PdfIframe base64={pdfFilInnhold} />
                </div>
            )}
        </DataViewer>
    );
};
