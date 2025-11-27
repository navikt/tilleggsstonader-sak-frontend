import React from 'react';

type Props = {
    startLat: number | undefined;
    startLon: number | undefined;
    stopLat: number | undefined;
    stopLon: number | undefined;
};
export const EnturLenke: React.FC<Props> = ({ startLat, startLon, stopLat, stopLon }: Props) => {
    return (
        <a
            rel={'noreferrer'}
            target={'_blank'}
            href={`https://entur.no/reiseresultater?transportModes=rail%2Ctram%2Cbus%2Ccoach%2Cwater%2Ccar_ferry%2Cmetro%2Cflytog%2Cflybuss&date=${new Date()}&tripMode=oneway&walkSpeed=1.3&minimumTransferTime=120&timepickerMode=departAfter&startLat=${startLat}&startLon=${startLon}&stopLat=${stopLat}&stopLon=${stopLon}`}
        >
            Se reise hos entur
        </a>
    );
};
