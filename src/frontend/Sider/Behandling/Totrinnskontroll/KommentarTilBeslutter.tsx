import React from 'react';

import { Textarea } from '@navikt/ds-react';

export const KommentarTilBeslutter = ({
    kommentarTilBeslutter,
    settKommentarTilBeslutter,
}: {
    kommentarTilBeslutter: string | undefined;
    settKommentarTilBeslutter: (kommentar: string) => void;
}) => {
    return (
        <Textarea
            label="Kommentar til beslutter"
            description="Skal kun brukes til intern dialog med beslutter. Endelige vurderinger skal skrives i respektive begrunnelsesfelt."
            value={kommentarTilBeslutter}
            onChange={(e) => settKommentarTilBeslutter(e.target.value)}
            style={{ maxWidth: '400px' }}
        />
    );
};
