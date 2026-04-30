import React from 'react';

import { ChildEyesIcon } from '@navikt/aksel-icons';

import { OppsummeringEkspanderbarEnhet, OppsummeringFelt } from './Visningskomponenter';
import {
    FaktaBarn,
    typeBarnepassTilTekst,
    årsakBarnepassTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaBarn';
import { JaNei, jaNeiTilTekst } from '../../../../typer/common';
import { formaterIsoPeriode } from '../../../../utils/dato';
import { tekstEllerKode, toTitleCase } from '../../../../utils/tekstformatering';

export const BarnDetaljer: React.FC<{ barn: FaktaBarn }> = ({ barn }) => {
    const typePass = barn.søknadgrunnlag?.type;
    const startetIFemte = barn.søknadgrunnlag?.startetIFemte;
    const utgifter = barn.søknadgrunnlag?.utgifter;
    const årsak = barn.søknadgrunnlag?.årsak;
    const navn = toTitleCase(barn.registergrunnlag.navn);

    return (
        <OppsummeringEkspanderbarEnhet
            ariaLabel={`Opplysninger om ${navn}`}
            ikon={<ChildEyesIcon />}
            tittel={navn}
            variant="subtle"
        >
            <OppsummeringFelt label="Identitetsnummer" value={barn.ident} />
            {typePass && (
                <OppsummeringFelt
                    label="Passordning"
                    value={tekstEllerKode(typeBarnepassTilTekst, typePass)}
                />
            )}
            {utgifter && (
                <OppsummeringFelt
                    label="Har utgifter hele perioden?"
                    value={jaNeiTilTekst[utgifter.harUtgifterTilPassHelePerioden]}
                />
            )}
            {utgifter?.fom && utgifter.tom && (
                <OppsummeringFelt
                    label="Periode med utgifter"
                    value={formaterIsoPeriode(utgifter.fom, utgifter.tom)}
                />
            )}
            {startetIFemte !== undefined && (
                <OppsummeringFelt
                    label="Har startet i 5.klasse når tiltaket starter?"
                    value={jaNeiTilTekst[startetIFemte]}
                />
            )}
            {startetIFemte === JaNei.JA && årsak && (
                <OppsummeringFelt
                    label="Årsak"
                    value={tekstEllerKode(årsakBarnepassTilTekst, årsak)}
                />
            )}
        </OppsummeringEkspanderbarEnhet>
    );
};
