import React from 'react';

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
    const src = `/api/sak/kart/embedded-map?origin=${start}&destination=${destinasjon}&mode=driving`;

    return (
        <iframe
            title="Kart som viser reiserute"
            width="500"
            height="500"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={src}
        />
    );
};
