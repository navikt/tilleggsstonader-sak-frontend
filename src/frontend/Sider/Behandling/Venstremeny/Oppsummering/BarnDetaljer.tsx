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
import { tekstEllerKode } from '../../../../utils/tekstformatering';

const BarnDetaljer: React.FC<{ barn: FaktaBarn; defaultOpen?: boolean }> = ({
    barn,
    defaultOpen = false,
}) => {
    const typePass = barn.søknadgrunnlag?.type;
    const startetIFemte = barn.søknadgrunnlag?.startetIFemte;
    const utgifter = barn.søknadgrunnlag?.utgifter;
    const årsak = barn.søknadgrunnlag?.årsak;

    return (
        <OppsummeringEkspanderbarEnhet
            ariaLabel={`Opplysninger om ${barn.registergrunnlag.navn}`}
            defaultOpen={defaultOpen}
            ikon={<ChildEyesIcon />}
            tittel={`${barn.registergrunnlag.navn} ${barn.ident}`}
            variant="subtle"
        >
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

export default BarnDetaljer;
