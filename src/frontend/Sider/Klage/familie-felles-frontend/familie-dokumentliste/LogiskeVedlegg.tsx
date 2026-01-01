import * as React from 'react';

import { Detail } from '@navikt/ds-react';

import styles from './LogiskeVedlegg.module.css';

export interface ILogiskVedlegg {
    tittel: string;
}

export const LogiskeVedlegg: React.FC<{ logiskeVedlegg: ILogiskVedlegg[] | undefined }> = ({
    logiskeVedlegg,
}) => (
    <ul className={styles.logiskVedleggWrapper}>
        {logiskeVedlegg &&
            logiskeVedlegg.map((logiskVedlegg, index) => (
                <li key={logiskVedlegg.tittel + index}>
                    <Detail>{logiskVedlegg.tittel}</Detail>
                </li>
            ))}
    </ul>
);
