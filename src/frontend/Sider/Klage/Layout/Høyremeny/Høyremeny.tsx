import * as React from 'react';
import { useEffect, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

import { Dokumenter } from './Dokumenter';
import Historikk from './Historikk';
import styles from './Høyremeny.module.css';
import Valgvisning from './Valgvisning';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';

export enum Høyremenyvalg {
    Historikk = 'Historikk',
    Dokumenter = 'Dokumenter',
}

interface IHøyremenyProps {
    behandling: Klagebehandling;
    åpenHøyremeny: boolean;
}

export const Høyremeny: React.FC<IHøyremenyProps> = (props) => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Historikk);
    const { settÅpenHøyremeny, behandlingErRedigerbar } = useKlagebehandling();

    useEffect(() => {
        if (behandlingErRedigerbar) {
            settAktivtvalg(Høyremenyvalg.Historikk);
        }
    }, [props.behandling, behandlingErRedigerbar]);

    return (
        <>
            {props.åpenHøyremeny ? (
                <>
                    <div className={styles.hoyremeny}>
                        <button
                            className={styles.apneLukkeKnapp}
                            onClick={() => {
                                settÅpenHøyremeny(!props.åpenHøyremeny);
                            }}
                        >
                            <ChevronRightIcon className={styles.pilHoyreIkon} />
                        </button>
                        <Valgvisning aktiv={aktivtValg} settAktiv={settAktivtvalg} />
                        <Dokumenter hidden={aktivtValg !== Høyremenyvalg.Dokumenter} />
                        <Historikk hidden={aktivtValg !== Høyremenyvalg.Historikk} />
                    </div>
                </>
            ) : (
                <button
                    className={styles.apneLukkeKnapp}
                    onClick={() => {
                        settÅpenHøyremeny(!props.åpenHøyremeny);
                    }}
                >
                    <ChevronLeftIcon className={styles.pilVenstreIkon} />
                </button>
            )}
        </>
    );
};
