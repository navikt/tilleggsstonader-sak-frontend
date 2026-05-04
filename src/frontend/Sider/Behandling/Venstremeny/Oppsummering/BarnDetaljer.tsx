import React from 'react';

import { ChildEyesIcon } from '@navikt/aksel-icons';

import { SøknadInfoEkspanderbar, SøknadInfoFelt } from './Visningskomponenter';
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
        <SøknadInfoEkspanderbar
            ariaLabel={`Opplysninger om ${navn}`}
            ikon={<ChildEyesIcon />}
            tittel={navn}
            variant="subtle"
        >
            <SøknadInfoFelt label="Identitetsnummer" value={barn.ident} />
            {typePass && (
                <SøknadInfoFelt
                    label="Passordning"
                    value={tekstEllerKode(typeBarnepassTilTekst, typePass)}
                />
            )}
            {utgifter && (
                <SøknadInfoFelt
                    label="Har utgifter hele perioden?"
                    value={jaNeiTilTekst[utgifter.harUtgifterTilPassHelePerioden]}
                />
            )}
            {utgifter?.fom && utgifter.tom && (
                <SøknadInfoFelt
                    label="Periode med utgifter"
                    value={formaterIsoPeriode(utgifter.fom, utgifter.tom)}
                />
            )}
            {startetIFemte !== undefined && (
                <SøknadInfoFelt
                    label="Har startet i 5.klasse når tiltaket starter?"
                    value={jaNeiTilTekst[startetIFemte]}
                />
            )}
            {startetIFemte === JaNei.JA && årsak && (
                <SøknadInfoFelt
                    label="Årsak"
                    value={tekstEllerKode(årsakBarnepassTilTekst, årsak)}
                />
            )}
        </SøknadInfoEkspanderbar>
    );
};
