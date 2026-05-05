import React from 'react';

import { useOppsummeringFilter } from './useOppsummeringFilter';
import { Utdanning } from './Utdanning';
import { antallVedlegg, Vedlegg } from './Vedlegg';
import { SøknadInfoSeksjonFilter, Søknadsdato } from './Visningskomponenter';
import { YtelseSituasjon } from './YtelseSituasjon';
import { BehandlingFaktaLæremidler } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';

export const OppsummeringLæremidler: React.FC<{
    behandlingFakta: BehandlingFaktaLæremidler;
}> = ({ behandlingFakta }) => {
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const visUtdanningsseksjon = behandlingFakta.utdanning.søknadsgrunnlag != null;
    const { filtervalg, visFellesopplysninger, visVedlegg, onFilterChange, valgtSeksjon } =
        useOppsummeringFilter([], antallDokumenter);

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <SøknadInfoSeksjonFilter
                ariaLabel="Filtrer søknadsopplysninger for læremidler"
                onChange={onFilterChange}
                value={valgtSeksjon}
                valg={filtervalg}
            />
            {visFellesopplysninger && visUtdanningsseksjon && (
                <Utdanning faktaUtdanning={behandlingFakta.utdanning} />
            )}
            {visFellesopplysninger && (
                <YtelseSituasjon
                    faktaHovedytelse={behandlingFakta.hovedytelse}
                    arbeidOgOpphold={behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold}
                />
            )}
            {visVedlegg && <Vedlegg fakta={behandlingFakta.dokumentasjon} />}
        </>
    );
};
