import React from 'react';

import { InfoSeksjon, Informasjonskilde, Informasjonsrad } from './Visningskomponenter';
import {
    FaktaBarn,
    typeBarnepassTilTekst,
    årsakBarnepassTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaBarn';
import { JaNei } from '../../../../typer/common';

const BarnDetaljer: React.FC<{ barn: FaktaBarn }> = ({ barn }) => {
    const typePass = barn.søknadgrunnlag?.type;
    const årsak = barn.søknadgrunnlag?.årsak;

    return (
        <InfoSeksjon label={`${barn.registergrunnlag.navn} ${barn.ident}`}>
            <Informasjonsrad
                kilde={Informasjonskilde.SØKNAD}
                verdi={typePass && typeBarnepassTilTekst[typePass]}
            />
            {barn.søknadgrunnlag?.startetIFemte === JaNei.JA && (
                <Informasjonsrad
                    kilde={Informasjonskilde.SØKNAD}
                    verdi={årsak && årsakBarnepassTilTekst[årsak]}
                />
            )}
        </InfoSeksjon>
    );
};

export default BarnDetaljer;
