import React from 'react';

import { SøknadInfoFelt } from './Visningskomponenter';
import {
    adresseTilTekst,
    FaktaAdresse,
} from '../../../../typer/behandling/behandlingFakta/faktaAdresse';

export const AdresseFelt: React.FC<FaktaAdresse & { label: string }> = ({
    label,
    gateadresse,
    postnummer,
    poststed,
}) => {
    const adresseTekst = adresseTilTekst({ gateadresse, postnummer, poststed });

    if (!adresseTekst) {
        return null;
    }

    return <SøknadInfoFelt label={label} value={adresseTekst} copyText={adresseTekst} />;
};
