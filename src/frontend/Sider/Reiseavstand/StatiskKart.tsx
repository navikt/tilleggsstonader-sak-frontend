import React from 'react';
import { useEffect } from 'react';

import styles from './Reisedetaljer.module.css';
import { Reisedata } from './Typer/Reisedata';
import { StatiskKartRequest } from './Typer/StatiskKartRequest';

export const StatiskKart: React.FC<{
    kjøreavstandResponse: Reisedata;
    hentStatiskKart: (statiskKartRequest: StatiskKartRequest) => void;
    statiskKart: string | undefined;
}> = ({ kjøreavstandResponse, hentStatiskKart, statiskKart }) => {
    useEffect(() => {
        if (kjøreavstandResponse.reiserute) {
            hentStatiskKart({
                polyline: kjøreavstandResponse.reiserute.polyline.encodedPolyline,
                startLokasjon: kjøreavstandResponse.reiserute.startLokasjon,
                sluttLokasjon: kjøreavstandResponse.reiserute.sluttLokasjon,
            });
        }
    }, [kjøreavstandResponse, hentStatiskKart]);

    return (
        <>
            {statiskKart && (
                <img className={styles.kartBilde} src={statiskKart} alt={'Kart for reisen'} />
            )}
        </>
    );
};
