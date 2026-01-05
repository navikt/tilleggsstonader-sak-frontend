import React from 'react';

import styles from './EmbeddedKart.module.css';
import { Reisedata } from './Typer/Reisedata';

export const EmbeddedKart: React.FC<{
    kjøreavstandResponse: Reisedata;
}> = ({ kjøreavstandResponse }) => {
    if (!kjøreavstandResponse.reiserute) {
        return null;
    }

    const { startAdresse, sluttAdresse } = kjøreavstandResponse.reiserute;
    const start = encodeURIComponent(startAdresse);
    const destinasjon = encodeURIComponent(sluttAdresse);
    const src = `/api/kart/embedded-map?origin=${start}&destination=${destinasjon}&mode=driving`;

    return (
        <iframe
            title="Kart som viser reiserute"
            className={styles.iframe}
            loading="lazy"
            allowFullScreen
            src={src}
        />
    );
};
