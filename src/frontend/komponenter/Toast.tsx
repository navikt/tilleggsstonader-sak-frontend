import React, { useEffect } from 'react';

import { Alert } from '@navikt/ds-react';

import styles from './Toast.module.css';
import { useApp } from '../context/AppContext';
import { Toast as ToastEnum, toastTilTekst } from '../typer/toast';

const Toast: React.FC = () => {
    const { toast, settToast } = useApp();

    useEffect(() => {
        const timer = setTimeout(() => {
            settToast(undefined);
        }, 5000);
        return () => clearTimeout(timer);
    });

    switch (toast) {
        case null:
        case undefined:
            return null;

        case ToastEnum.DISABLED_FANE:
            return (
                <div className={styles.containerTopRight}>
                    <Alert variant="warning">{toastTilTekst[toast]}</Alert>
                </div>
            );

        default:
            return (
                <div className={styles.containerTopRight}>
                    <Alert variant="success">{toastTilTekst[toast]}</Alert>
                </div>
            );
    }
};

export default Toast;
