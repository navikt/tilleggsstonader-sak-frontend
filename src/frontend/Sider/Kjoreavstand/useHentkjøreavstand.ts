import { TransitOption } from './utils';
import { useApp } from '../../context/AppContext';

export type KjøreavstandRequest = {
    fraAdresse: ManuellAdresse;
    tilAdresse: ManuellAdresse;
};

export type ManuellAdresse = {
    gate: string;
    postnummer: string;
    poststed: string;
};

export interface RuteDto {
    routes?: Route[];
}

export interface Route {
    distanceMeters?: number;
    duration?: string;
    legs?: Leg[];
}

export interface Leg {
    steps?: Step[];
}

export interface Step {
    travelMode?: string;
    startLocation?: Location;
    endLocation?: Location;
    transitDetails?: TransitDetails;
    distanceMeters?: number;
    staticDuration?: string;
}

export interface TransitDetails {
    stopDetails?: StopDetails;
    transitLine?: TransitLine;
    stopCount?: number;
}

export interface StopDetails {
    departureStop?: Stop;
    arrivalStop?: Stop;
}

export interface Stop {
    name?: string;
    location?: Location;
}

export interface Location {
    latLng?: LatLng;
}

export interface LatLng {
    latitude?: number;
    longitude?: number;
}

export interface TransitLine {
    shortName?: string;
    name?: string;
    vehicle?: Vehicle;
}

export interface Vehicle {
    type?: TransitOption;
}

export const useHentKjøreavstand = () => {
    const { request } = useApp();

    const hentKjøreavstand = (fra: ManuellAdresse, til: ManuellAdresse) =>
        request<RuteDto, KjøreavstandRequest>(`/api/sak/kjoreavstand`, 'POST', {
            fraAdresse: fra,
            tilAdresse: til,
        });

    return { hentKjøreavstand };
};
