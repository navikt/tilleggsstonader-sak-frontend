import React, { useState } from 'react';

import 'leaflet/dist/leaflet.css';

import polyline from '@mapbox/polyline';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'proj4leaflet';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

import { Radio, RadioGroup } from '@navikt/ds-react';

import './proj4leaflet.d';
import styles from './EmbeddedKart.module.css';
import { Reisedata } from './Typer/Reisedata';

const BlåTegnestift = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Definer UTM33 projeksjon for Kartverket
const crsUtm33 = new L.Proj.CRS(
    'EPSG:25833',
    '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    {
        origin: [-2500000, 9045984],
        resolutions: Array.from(Array(19), (_, i) => 21664 / Math.pow(2, i)),
    }
) as L.CRS;

export const Kart: React.FC<{
    kjøreavstandResponse: Reisedata;
}> = ({ kjøreavstandResponse }) => {
    const [kartkilde, setKartkilde] = useState<'kartverket' | 'google-maps'>('kartverket');

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

    // Velg kartkilde basert på valgt alternativ
    const tileUrl =
        kartkilde === 'google-maps'
            ? '/api/kart/google-maps-tiles/{z}/{x}/{y}'
            : '/api/kartverket-tiles/{z}/{x}/{y}';
    const attribution = kartkilde === 'google-maps' ? '' : '© Kartverket';
    const crs = kartkilde === 'google-maps' ? L.CRS.EPSG3857 : crsUtm33;

    return (
        <>
            <RadioGroup
                legend="Velg kartkilde"
                value={kartkilde}
                onChange={(val: 'kartverket' | 'google-maps') => setKartkilde(val)}
                style={{ marginBottom: '1rem' }}
            >
                <Radio value="kartverket">Kartverket</Radio>
                <Radio value="google-maps">Google Maps</Radio>
            </RadioGroup>
            <MapContainer
                key={kartkilde}
                bounds={bounds}
                boundsOptions={{ padding: [20, 20] }}
                scrollWheelZoom={true}
                className={styles.container}
                attributionControl={false}
                crs={crs}
                minZoom={5}
                maxZoom={18}
            >
                <TileLayer url={tileUrl} attribution={attribution} tileSize={256} />
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
        </>
    );
};
