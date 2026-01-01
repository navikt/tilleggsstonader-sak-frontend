import * as React from 'react';

import { ClockFillIcon, FolderIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Høyremenyvalg } from './Høyremeny';
import styles from './Valgvisning.module.css';

interface ValgvisningProps {
    settAktiv: (aktivtValg: Høyremenyvalg) => void;
    aktiv: Høyremenyvalg;
}

const Valgvisning: React.FC<ValgvisningProps> = ({ aktiv, settAktiv }) => {
    return (
        <div className={styles.ikonWrapper}>
            <div
                role={'button'}
                className={`${styles.ikon} ${aktiv === Høyremenyvalg.Historikk ? styles.ikonAktiv : ''}`}
                onClick={() => settAktiv(Høyremenyvalg.Historikk)}
            >
                <ClockFillIcon aria-label="Historikk" fontSize="1.5rem" />
                <BodyShort size={'small'}>Historikk</BodyShort>
            </div>
            <div
                role={'button'}
                className={`${styles.ikon} ${aktiv === Høyremenyvalg.Dokumenter ? styles.ikonAktiv : ''}`}
                onClick={() => settAktiv(Høyremenyvalg.Dokumenter)}
            >
                <FolderIcon aria-label="Dokumentoversikt" fontSize="1.5rem" />
                <BodyShort size={'small'}>Dokumenter</BodyShort>
            </div>
        </div>
    );
};

export default Valgvisning;
