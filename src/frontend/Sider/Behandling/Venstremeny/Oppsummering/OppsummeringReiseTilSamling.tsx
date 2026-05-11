import React from 'react';

import { Aktivitet } from './Aktivitet';
import { useOppsummeringFilter } from './useOppsummeringFilter';
import { antallVedlegg, Vedlegg } from './Vedlegg';
import { SøknadInfoSeksjonFilter, Søknadsdato } from './Visningskomponenter';
import { YtelseSituasjon } from './YtelseSituasjon';
import { BehandlingFaktaReiseTilSamling } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';

export const OppsummeringReiseTilSamling: React.FC<{
    behandlingFakta: BehandlingFaktaReiseTilSamling;
}> = ({ behandlingFakta }) => {
    const antallDokumenter = antallVedlegg(behandlingFakta.dokumentasjon);
    const {
        filtervalg,
        visFellesopplysninger,
        visSeksjon,
        visVedlegg,
        onFilterChange,
        valgtSeksjon,
    } = useOppsummeringFilter(
        behandlingFakta.samlinger?.length > 0
            ? [
                  {
                      value: 'samlinger',
                      label: 'Samlinger',
                      ariaLabel: 'Vis samlinger fra søknaden',
                      count: behandlingFakta.samlinger?.length,
                  },
              ]
            : [],
        antallDokumenter
    );

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <SøknadInfoSeksjonFilter
                ariaLabel="Filtrer søknadsopplysninger for reise til samling"
                onChange={onFilterChange}
                value={valgtSeksjon}
                valg={filtervalg}
            />
            {visFellesopplysninger && (
                <>
                    <Aktivitet aktivitet={behandlingFakta.aktiviteter} />
                    <YtelseSituasjon
                        faktaHovedytelse={behandlingFakta.hovedytelse}
                        arbeidOgOpphold={
                            behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold
                        }
                    />
                </>
            )}
            {visSeksjon('samlinger') && behandlingFakta.samlinger?.length > 0 && <>TODO</>}
            {visVedlegg && <Vedlegg fakta={behandlingFakta.dokumentasjon} />}
        </>
    );
};
