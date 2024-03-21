import React from 'react';

import styled from 'styled-components';

import DokumentPanel from './DokumentPanel';
import { JournalføringState } from '../../../hooks/useJournalføringState';

const Liste = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
`;

interface Props {
    journalpostState: JournalføringState;
}

const Dokumenter: React.FC<Props> = ({ journalpostState }) => {
    return (
        <Liste>
            {journalpostState.journalpost.dokumenter.map((dokument) => (
                <li key={dokument.dokumentInfoId}>
                    <DokumentPanel dokument={dokument} journalpostState={journalpostState} />
                </li>
            ))}
        </Liste>
    );
};

export default Dokumenter;
