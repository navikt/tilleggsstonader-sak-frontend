import { LinjeType } from './Reisedata';

export function meterTilKm(meter: number) {
    return (meter / 1000).toFixed(1);
}

export function sekunderTilTimerOgMinutter(sekunder: number) {
    const timer = Math.floor(sekunder / 3600);
    const gjennværendeSekunder = sekunder % 3600;

    const minutter = Math.floor(gjennværendeSekunder / 60);
    if (timer > 0) {
        return `${timer} timer og ${minutter} minutter`;
    }
    return `${minutter} minutter`;
}

export const linjeTypeTilText: Record<LinjeType, string> = {
    BUS: 'buss',
    INTERCITY_BUS: 'buss',
    SHARE_TAXI: 'buss',
    TROLLEYBUS: 'buss',
    CABLE_CAR: 'taubane',
    FUNICULAR: 'taubane',
    GONDOLA_LIFT: 'taubane',
    COMMUTER_TRAIN: 'tog',
    HEAVY_RAIL: 'tog',
    HIGH_SPEED_TRAIN: 'tog',
    LONG_DISTANCE_TRAIN: 'tog',
    RAIL: 'tog',
    FERRY: 'ferge',
    METRO_RAIL: 't-bane',
    SUBWAY: 't-bane',
    TRAM: 'trikk',
    MONORAIL: 'monorail',
    OTHER: 'annet',
};
