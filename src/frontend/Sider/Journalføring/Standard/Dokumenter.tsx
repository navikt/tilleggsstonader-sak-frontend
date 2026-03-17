import React from 'react';

import styles from './Dokumenter.module.css';
import { DokumentPanel } from './DokumentPanel';
import { JournalføringState } from '../../../hooks/useJournalføringState';

interface Props {
    journalføringState: JournalføringState;
}

export const Dokumenter: React.FC<Props> = ({ journalføringState }) => (
    <ul className={styles.liste}>
        {journalføringState.journalpost.dokumenter.map((dokument) => (
            <li key={dokument.dokumentInfoId}>
                <DokumentPanel dokument={dokument} journalføringState={journalføringState} />
            </li>
        ))}
    </ul>
);
