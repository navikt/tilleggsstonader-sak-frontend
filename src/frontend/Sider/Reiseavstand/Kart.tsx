import React from 'react';

import 'leaflet/dist/leaflet.css';

import polyline from '@mapbox/polyline';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

import styles from './EmbeddedKart.module.css';
import { Reisedata } from './Typer/Reisedata';

const BlåTegnestift = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export const Kart: React.FC<{
    kjøreavstandResponse: Reisedata;
}> = ({ kjøreavstandResponse }) => {
    if (!kjøreavstandResponse.reiserute) {
        return null;
    }

    const {
        startLokasjon,
        sluttLokasjon,
        polyline: encodedPolyline,
    } = kjøreavstandResponse.reiserute;

    const positions = polyline.decode(encodedPolyline.encodedPolyline);
    const bounds = L.latLngBounds(positions);

    return (
        <MapContainer
            bounds={bounds}
            boundsOptions={{ padding: [20, 20] }}
            scrollWheelZoom={true}
            className={styles.container}
            attributionControl={false}
            minZoom={5}
            maxZoom={15}
        >
            <TileLayer url="/api/kart/tiles/{z}/{x}/{y}" />
            <Marker
                position={[startLokasjon.lat, startLokasjon.lng]}
                alt="Startposisjon"
                title="Startposisjon"
                icon={BlåTegnestift}
            />
            <Marker
                position={[sluttLokasjon.lat, sluttLokasjon.lng]}
                alt="Tiltaksadresse"
                title="Tiltaksadresse"
                icon={BlåTegnestift}
            />
            <Polyline positions={positions} color="blue" />
        </MapContainer>
    );
};
