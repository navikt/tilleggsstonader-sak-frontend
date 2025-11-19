import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { EnturLenke } from './EnturLenke';
import { Route } from './useHentkjøreavstand';
import { transitOptionTilIkon, transitOptionTilText } from './utils';

type Props = {
    route: Route;
    fra: string;
    til: string;
};

export const KjoreavstandResponse: React.FC<Props> = ({ route, fra, til }: Props) => {
    return (
        <div
            style={{
                border: 'solid 2px lightblue',
                padding: '1rem',
                width: 'fit-content',
                marginTop: '1rem',
            }}
        >
            <BodyShort>
                Mellom {fra} og {til} er det: {(route.distanceMeters ?? 0) / 1000} km
            </BodyShort>
            <BodyShort>Estimert tid: {route.duration}</BodyShort>

            {route.legs?.map((leg, legIndex) => (
                <div key={legIndex} style={{ marginTop: '0.5rem' }}>
                    {leg.steps?.map((step, stepIndex) => {
                        const td = step.transitDetails;

                        if (!td) {
                            return (
                                <div key={stepIndex}>
                                    <BodyShort size="small">
                                        Gå {step.staticDuration} sek ({step.distanceMeters} m)
                                    </BodyShort>
                                </div>
                            );
                        }

                        return (
                            <div key={`child-${legIndex}`}>
                                <hr />
                                {td.transitLine?.vehicle?.type && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            padding: '1rem',
                                            border: 'solid 1px black',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                marginBottom: '1rem',
                                                gap: '8px',
                                            }}
                                        >
                                            {transitOptionTilIkon(td.transitLine.vehicle.type)}
                                            <BodyShort key={stepIndex} size="small">
                                                Ta{' '}
                                                {transitOptionTilText[td.transitLine.vehicle.type]}{' '}
                                                {td.transitLine?.shortName} mot{' '}
                                                {td.transitLine?.name}
                                            </BodyShort>
                                        </div>
                                        <div>
                                            <BodyShort>
                                                Fra stopp: {td.stopDetails?.departureStop?.name}
                                            </BodyShort>
                                            <BodyShort>
                                                Til stopp: {td.stopDetails?.arrivalStop?.name}
                                            </BodyShort>
                                        </div>
                                        <EnturLenke
                                            startLat={
                                                td.stopDetails?.departureStop?.location?.latLng
                                                    ?.latitude
                                            }
                                            startLon={
                                                td.stopDetails?.departureStop?.location?.latLng
                                                    ?.longitude
                                            }
                                            stopLat={
                                                td.stopDetails?.arrivalStop?.location?.latLng
                                                    ?.latitude
                                            }
                                            stopLon={
                                                td.stopDetails?.arrivalStop?.location?.latLng
                                                    ?.longitude
                                            }
                                        />
                                    </div>
                                )}
                                <hr />
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
