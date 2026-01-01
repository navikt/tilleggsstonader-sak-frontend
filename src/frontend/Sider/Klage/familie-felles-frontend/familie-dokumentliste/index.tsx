import * as React from 'react';

import { Detail, Label } from '@navikt/ds-react';

import styles from './Dokumentliste.module.css';
import { ILogiskVedlegg, LogiskeVedlegg } from './LogiskeVedlegg';
import PilHøyre from '../familie-ikoner/piler/PilHøyre';
import PilNed from '../familie-ikoner/piler/PilNed';
import PilVenstre from '../familie-ikoner/piler/PilVenstre';

export enum Journalposttype {
    I = 'I',
    U = 'U',
    N = 'N',
}

interface JournalpostikonProps {
    journalposttype: Journalposttype;
}

const Journalpostikon: React.FC<JournalpostikonProps> = ({ journalposttype }) => {
    switch (journalposttype) {
        case 'I':
            return <PilVenstre heigth={16} width={16} />;
        case 'N':
            return <PilNed heigth={16} width={16} />;
        case 'U':
            return <PilHøyre heigth={16} width={16} />;
        default:
            return <div />;
    }
};

export interface DokumentProps {
    tittel: string;
    dato?: string;
    journalpostId: string;
    journalposttype: Journalposttype;
    dokumentinfoId: string;
    filnavn?: string;
    logiskeVedlegg?: ILogiskVedlegg[];
}

export interface DokumentElementProps {
    dokument: DokumentProps;
    onClick: (dokument: DokumentProps) => void;
}

export interface DokumentlisteProps {
    dokumenter: DokumentProps[];
    onClick: (dokument: DokumentProps) => void;
    className?: string;
}

export const DokumentElement: React.FC<DokumentElementProps> = ({ dokument, onClick }) => {
    return (
        <li>
            <button onClick={() => onClick(dokument)} className={styles.knapp}>
                <span className={styles.journalpostIkon}>
                    <Journalpostikon journalposttype={dokument.journalposttype} />
                </span>
                <Label size={'small'} className={styles.dokumentnavn}>
                    {dokument.tittel}
                </Label>
                <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
                <Detail className={styles.undertekst}>{dokument.dato}</Detail>
            </button>
        </li>
    );
};

export const Dokumentliste: React.FC<DokumentlisteProps> = ({ dokumenter, onClick, className }) => {
    return (
        <ul className={`${styles.dokumentListe} ${className ?? ''}`}>
            {dokumenter.map((dokument: DokumentProps, indeks: number) => {
                return <DokumentElement dokument={dokument} onClick={onClick} key={indeks} />;
            })}
        </ul>
    );
};
