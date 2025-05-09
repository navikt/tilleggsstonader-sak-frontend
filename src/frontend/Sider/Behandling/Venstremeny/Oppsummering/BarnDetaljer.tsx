import React from 'react';

import { ChildEyesIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    FaktaBarn,
    typeBarnepassTilTekst,
    årsakBarnepassTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaBarn';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

const BarnDetaljer: React.FC<{ barn: FaktaBarn }> = ({ barn }) => {
    const typePass = barn.søknadgrunnlag?.type;
    const startetIFemte = barn.søknadgrunnlag?.startetIFemte;
    const utgifter = barn.søknadgrunnlag?.utgifter;
    const årsak = barn.søknadgrunnlag?.årsak;

    return (
        <InfoSeksjon label={`${barn.registergrunnlag.navn} ${barn.ident}`} ikon={<ChildEyesIcon />}>
            <BodyShort size="small">{tekstEllerKode(typeBarnepassTilTekst, typePass)}</BodyShort>
            {utgifter && (
                <>
                    <BodyShort size="small">
                        Har utgifter hele perioden:{' '}
                        {jaNeiTilTekst[utgifter.harUtgifterTilPassHelePerioden]}
                    </BodyShort>
                    {utgifter.fom && utgifter.tom && (
                        <BodyShort size="small">
                            Har utgifter: ${formaterIsoPeriode(utgifter.fom, utgifter.tom)}
                        </BodyShort>
                    )}
                </>
            )}
            {startetIFemte !== undefined && (
                <>
                    <BodyShort size="small">
                        {startetIFemte === JaNei.JA
                            ? 'Startet i 5. klasse'
                            : 'Ikke startet i 5. klasse'}
                    </BodyShort>

                    {startetIFemte === JaNei.JA && (
                        <BodyShort size="small">
                            {tekstEllerKode(årsakBarnepassTilTekst, årsak)}{' '}
                        </BodyShort>
                    )}
                </>
            )}
        </InfoSeksjon>
    );
};

export default BarnDetaljer;
