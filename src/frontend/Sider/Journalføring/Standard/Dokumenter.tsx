import React from 'react';

import styles from './Dokumenter.module.css';
import { DokumentPanel } from './DokumentPanel';
import { JournalføringState } from '../../../hooks/useJournalføringState';

interface Props {
    journalpostState: JournalføringState;
}

export const Dokumenter: React.FC<Props> = ({ journalpostState }) => (
    <ul className={styles.liste}>
        {journalpostState.journalpost.dokumenter.map((dokument) => (
            <li key={dokument.dokumentInfoId}>
                <DokumentPanel dokument={dokument} journalpostState={journalpostState} />
            </li>
        ))}
    </ul>
);
