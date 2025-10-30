import React from 'react';

type Props = {
    fra: string;
    fraPoststed: string;
    fraPostkode: string;
    til: string;
    tilPoststed: string;
    tilPostkode: string;
};

export const GoogleMapsEmbededIFrame: React.FC<Props> = ({
    fra,
    fraPostkode,
    fraPoststed,
    til,
    tilPostkode,
    tilPoststed,
}: Props) => {
    return (
        <iframe
            title={'google maps'}
            width="600"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/directions?origin=${fra},${fraPostkode},${fraPoststed}&destination=${til},${tilPostkode},${tilPoststed}}&mode=transit&mode=walking&mode=driving&key=`}
        />
    );
};
