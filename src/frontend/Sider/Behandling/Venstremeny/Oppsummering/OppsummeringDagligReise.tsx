import React from 'react';

import { AktivitetDagligReise } from './AktivitetDagligReise';
import { ReiseDetaljer } from './ReiseDetlajer/ReiseDetaljer';
import { useOppsummeringFilter } from './UseOppsummeringFilter';
import { antallVedlegg, Vedlegg } from './Vedlegg';
import { OppsummeringSeksjonsfilter, Søknadsdato } from './Visningskomponenter';
import { YtelseSituasjon } from './YtelseSituasjon';
import { BehandlingFaktaDagligReise } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';

export const OppsummeringDagligReise: React.FC<{
    behandlingFakta: BehandlingFaktaDagligReise;
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
        behandlingFakta.reiser.length > 0
            ? [
                  {
                      value: 'reiser',
                      label: 'Reiser',
                      ariaLabel: 'Vis reiseopplysninger',
                      count: behandlingFakta.reiser.length,
                  },
              ]
            : [],
        antallDokumenter
    );

    return (
        <>
            <Søknadsdato dato={behandlingFakta.søknadMottattTidspunkt} />
            <OppsummeringSeksjonsfilter
                ariaLabel="Filtrer søknadsopplysninger for daglig reise"
                onChange={onFilterChange}
                value={valgtSeksjon}
                valg={filtervalg}
            />
            {visFellesopplysninger && (
                <>
                    {behandlingFakta.aktiviteter && (
                        <AktivitetDagligReise aktiviteter={behandlingFakta.aktiviteter} />
                    )}
                    <YtelseSituasjon
                        faktaHovedytelse={behandlingFakta.hovedytelse}
                        arbeidOgOpphold={
                            behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold
                        }
                    />
                </>
            )}
            {visSeksjon('reiser') && behandlingFakta.reiser.length > 0 && (
                <ReiseDetaljer reiser={behandlingFakta.reiser}></ReiseDetaljer>
            )}
            {visVedlegg && <Vedlegg fakta={behandlingFakta.dokumentasjon} />}
        </>
    );
};
