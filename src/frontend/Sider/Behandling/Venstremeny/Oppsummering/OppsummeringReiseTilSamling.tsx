import React from 'react';

import { Aktivitet } from './Aktivitet';
import { useOppsummeringFilter } from './UseOppsummeringFilter';
import { antallVedlegg, Vedlegg } from './Vedlegg';
import { OppsummeringSeksjonsfilter, Søknadsdato } from './Visningskomponenter';
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
        behandlingFakta.samlinger.length > 0
            ? [
                  {
                      value: 'samlinger',
                      label: 'Samlinger',
                      ariaLabel: 'Vis samlinger fra søknaden',
                      count: behandlingFakta.samlinger.length,
                  },
              ]
            : [],
        antallDokumenter
    );

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <OppsummeringSeksjonsfilter
                ariaLabel="Filtrer søknadsopplysninger for tilsyn barn"
                onChange={onFilterChange}
                value={valgtSeksjon}
                valg={filtervalg}
            />
            {visFellesopplysninger && (
                <>
                    {behandlingFakta.aktiviteter && (
                        <Aktivitet aktivitet={behandlingFakta.aktiviteter} />
                    )}
                    <YtelseSituasjon
                        faktaHovedytelse={behandlingFakta.hovedytelse}
                        arbeidOgOpphold={
                            behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold
                        }
                    />
                </>
            )}
            {visSeksjon('samlinger') && behandlingFakta.samlinger.length > 0 && <>TODO</>}
            {visVedlegg && <Vedlegg fakta={behandlingFakta.dokumentasjon} />}
        </>
    );
};
