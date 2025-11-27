import { Lokasjon } from './Reisedata';

export interface StatiskKartRequest {
    polyline: string;
    startLokasjon: Lokasjon;
    sluttLokasjon: Lokasjon;
}
