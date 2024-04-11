import React from 'react';

import { InfoSeksjon, Informasjonskilde, Informasjonsrad } from './Visningskomponenter';
import {
    FaktaBarn,
    typeBarnepassTilTekst,
    årsakBarnepassTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaBarn';
import { JaNei } from '../../../../typer/common';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

const BarnDetaljer: React.FC<{ barn: FaktaBarn }> = ({ barn }) => {
    const typePass = barn.søknadgrunnlag?.type;
    const startetIFemte = barn.søknadgrunnlag?.startetIFemte;
    const årsak = barn.søknadgrunnlag?.årsak;

    return (
        <InfoSeksjon label={`${barn.registergrunnlag.navn} ${barn.ident}`}>
            <Informasjonsrad
                kilde={Informasjonskilde.SØKNAD}
                verdi={tekstEllerKode(typeBarnepassTilTekst, typePass)}
            />
            {startetIFemte !== undefined && (
                <>
                    <Informasjonsrad
                        kilde={Informasjonskilde.SØKNAD}
                        verdi={
                            startetIFemte === JaNei.JA
                                ? 'Startet i 5. klasse'
                                : 'Ikke startet i 5. klasse'
                        }
                    />
                    {startetIFemte === JaNei.JA && (
                        <Informasjonsrad
                            kilde={Informasjonskilde.SØKNAD}
                            verdi={tekstEllerKode(årsakBarnepassTilTekst, årsak)}
                        />
                    )}
                </>
            )}
        </InfoSeksjon>
    );
};

export default BarnDetaljer;
