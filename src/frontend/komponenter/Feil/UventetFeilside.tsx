import React, { useEffect, useRef } from 'react';

import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { BodyShort, Detail, GlobalAlert } from '@navikt/ds-react';

import styles from './UventetFeilside.module.css';
import { useApp } from '../../context/AppContext';

interface Feilinformasjon {
    melding: string;
    stack?: string;
}

const hentFeilinformasjon = (error: unknown): Feilinformasjon => {
    if (isRouteErrorResponse(error)) {
        return {
            melding: `${error.status} ${error.statusText}`,
            stack: typeof error.data === 'string' ? error.data : undefined,
        };
    }

    if (error instanceof Error) {
        return {
            melding: error.message,
            stack: error.stack,
        };
    }

    if (typeof error === 'string') {
        return { melding: error };
    }

    return { melding: 'Ukjent feil. Se konsollen for flere detaljer.' };
};

const loggFeil = (error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Uventet feil i frontend', error);
};

export const UventetFeilside: React.FC = () => {
    const error = useRouteError();
    const { appEnv } = useApp();
    const harLoggetFeil = useRef(false);
    const { melding, stack } = hentFeilinformasjon(error);
    const erUtvikling = appEnv.unleashEnv !== 'production';

    useEffect(() => {
        if (harLoggetFeil.current) {
            return;
        }

        harLoggetFeil.current = true;
        loggFeil(error);
    }, [error]);

    return (
        <div className={styles.container}>
            <GlobalAlert status={'error'}>
                <GlobalAlert.Header>
                    <GlobalAlert.Title>Det skjedde en uventet feil </GlobalAlert.Title>
                </GlobalAlert.Header>
                <GlobalAlert.Content>
                    <BodyShort spacing>{melding}</BodyShort>
                    <Detail className={styles.side}>Side: {window.location.pathname}</Detail>

                    {erUtvikling ? (
                        <>
                            <BodyShort spacing>Originalfeilen er logget til konsollen.</BodyShort>

                            {stack && (
                                <details className={styles.tekniskeDetaljer}>
                                    <summary>Vis tekniske detaljer</summary>
                                    <pre className={styles.stacktrace}>{stack}</pre>
                                </details>
                            )}
                        </>
                    ) : (
                        <BodyShort>
                            Dette er en feil som normalt sett ikke skal oppstå. Vennligst ta kontakt
                            med utviklerteamet på Teams.
                        </BodyShort>
                    )}
                </GlobalAlert.Content>
            </GlobalAlert>
        </div>
    );
};
