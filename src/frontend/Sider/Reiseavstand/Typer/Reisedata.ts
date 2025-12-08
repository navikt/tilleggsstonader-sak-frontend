export interface Reisedata {
    reiserute?: Reiserute;
}

export interface Reiserute {
    polyline: Polyline;
    avstandMeter: number;
    varighetSekunder: number;
    strekninger: Strekninger[];
    startLokasjon: Lokasjon;
    sluttLokasjon: Lokasjon;
}

export interface Strekninger {
    varighetSekunder: number;
    reisetype: Reisetype;
    kollektivDetaljer: KollektivDetaljer;
}

export interface KollektivDetaljer {
    startHoldeplass: string;
    sluttHoldeplass: string;
    linjeNavn: string;
    linjeType: LinjeType;
    operatør: Operatør[];
}

export interface Operatør {
    navn: string;
    url: string;
}

export interface Polyline {
    encodedPolyline: string;
}

export interface Lokasjon {
    lat: number;
    lng: number;
}

export enum LinjeType {
    BUS = 'BUS',
    CABLE_CAR = 'CABLE_CAR',
    COMMUTER_TRAIN = 'COMMUTER_TRAIN',
    FERRY = 'FERRY',
    FUNICULAR = 'FUNICULAR',
    GONDOLA_LIFT = 'GONDOLA_LIFT',
    HEAVY_RAIL = 'HEAVY_RAIL',
    HIGH_SPEED_TRAIN = 'HIGH_SPEED_TRAIN',
    INTERCITY_BUS = 'INTERCITY_BUS',
    LONG_DISTANCE_TRAIN = 'LONG_DISTANCE_TRAIN',
    METRO_RAIL = 'METRO_RAIL',
    MONORAIL = 'MONORAIL',
    OTHER = 'OTHER',
    RAIL = 'RAIL',
    SHARE_TAXI = 'SHARE_TAXI',
    SUBWAY = 'SUBWAY',
    TRAM = 'TRAM',
    TROLLEYBUS = 'TROLLEYBUS',
}

export enum Reisetype {
    TRAVEL_MODE_UNSPECIFIED = 'TRAVEL_MODE_UNSPECIFIED',
    DRIVE = 'DRIVE',
    BICYCLE = 'BICYCLE',
    WALK = 'WALK',
    TWO_WHEELER = 'TWO_WHEELER',
    TRANSIT = 'TRANSIT',
}
