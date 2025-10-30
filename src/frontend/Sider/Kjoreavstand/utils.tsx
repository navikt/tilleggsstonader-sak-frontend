import React from 'react';

import { BusIcon, TrainIcon, TramIcon } from '@navikt/aksel-icons';

export type TransitOption =
    | 'BUS'
    | 'INTERCITY_BUS'
    | 'SUBWAY'
    | 'TRAIN'
    | 'LIGHT_RAIL'
    | 'HEAVY_RAIL'
    | 'RAIL';

export const transitOptionTilText: Record<TransitOption, string> = {
    BUS: 'buss',
    INTERCITY_BUS: 'buss',
    SUBWAY: 't-bane',
    TRAIN: 'tog',
    HEAVY_RAIL: 'tog',
    LIGHT_RAIL: 'trikk',
    RAIL: 'tog',
};

export const transitOptionTilIkon = (option: TransitOption | undefined) => {
    switch (option) {
        case 'BUS':
            return <BusIcon style={{ backgroundColor: 'orange' }} />;
        case 'INTERCITY_BUS':
            return <BusIcon style={{ backgroundColor: 'blue' }} />;
        case 'SUBWAY':
            return <TrainIcon />;
        case 'TRAIN':
            return <TrainIcon />;
        case 'LIGHT_RAIL':
            return <TramIcon />;
        case 'HEAVY_RAIL':
            return <TrainIcon />;
        case 'RAIL':
            return <TrainIcon />;
    }
};
